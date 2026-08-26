package com.student.management.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.student.management.config.PayOSConfig;
import com.student.management.dto.req.CreatePaymentCheckoutRequestDto;
import com.student.management.dto.req.TuitionPaymentRequestDto;
import com.student.management.dto.resp.PaymentTransactionResponseDto;
import com.student.management.entity.PaymentTransaction;
import com.student.management.entity.Semester;
import com.student.management.entity.Student;
import com.student.management.entity.TuitionInvoice;
import com.student.management.enums.PaymentMethod;
import com.student.management.enums.PaymentTransactionStatus;
import com.student.management.enums.TuitionInvoiceStatus;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.PaymentTransactionRepository;
import com.student.management.repository.StudentRepository;
import com.student.management.repository.TuitionInvoiceRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PayOSServiceTest {

    @Mock
    private PayOSConfig payOSConfig;

    @Mock
    private RestClient payOSRestClient;

    @Mock
    private PaymentTransactionRepository paymentTransactionRepository;

    @Mock
    private TuitionInvoiceRepository tuitionInvoiceRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private TuitionService tuitionService;

    @Mock
    private EmailReceiptService emailReceiptService;

    @Mock
    private TelegramAlertService telegramAlertService;

    @Spy
    private ObjectMapper objectMapper = new ObjectMapper();

    @InjectMocks
    private PayOSService payOSService;

    private Student student;
    private TuitionInvoice invoice;
    private Semester semester;

    @BeforeEach
    void setUp() {
        student = Student.builder()
                .studentId("SV001")
                .fullName("Nguyen Van A")
                .email("student@edu.vn")
                .build();

        semester = Semester.builder()
                .id(1L)
                .semesterCode("20261")
                .name("Hoc ky 1 2026-2027")
                .startDate(LocalDate.of(2026, 9, 1))
                .endDate(LocalDate.of(2027, 1, 15))
                .build();

        invoice = TuitionInvoice.builder()
                .id(100L)
                .invoiceCode("INV-20261-SV001")
                .student(student)
                .semester(semester)
                .totalAmount(new BigDecimal("4500000.00"))
                .paidAmount(BigDecimal.ZERO)
                .remainingAmount(new BigDecimal("4500000.00"))
                .status(TuitionInvoiceStatus.UNPAID)
                .dueDate(LocalDate.of(2026, 10, 1))
                .build();
    }

    @Test
    @DisplayName("Tạo Checkout PayOS thành công khi sinh viên sở hữu hóa đơn và còn dư nợ")
    void createCheckout_success() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student));
        when(tuitionInvoiceRepository.findById(100L)).thenReturn(Optional.of(invoice));
        when(payOSConfig.isConfigured()).thenReturn(false); // Mock mode test

        when(paymentTransactionRepository.save(any(PaymentTransaction.class))).thenAnswer(inv -> {
            PaymentTransaction txn = inv.getArgument(0);
            txn.setId(1L);
            return txn;
        });

        CreatePaymentCheckoutRequestDto req = CreatePaymentCheckoutRequestDto.builder()
                .invoiceId(100L)
                .build();

        PaymentTransactionResponseDto resp = payOSService.createCheckout("SV001", req);

        assertNotNull(resp);
        assertEquals("SV001", resp.getStudentId());
        assertEquals(100L, resp.getInvoiceId());
        assertEquals(0, new BigDecimal("4500000.00").compareTo(resp.getAmount()));
        assertEquals(PaymentTransactionStatus.PENDING, resp.getStatus());
        assertEquals(PaymentMethod.PAYOS, resp.getPaymentMethod());
        verify(paymentTransactionRepository, times(1)).save(any(PaymentTransaction.class));
    }

    @Test
    @DisplayName("Chặn tạo Checkout nếu sinh viên A cố ý nộp hóa đơn của sinh viên B (Chống IDOR)")
    void createCheckout_idorAttack_forbidden() {
        Student otherStudent = Student.builder().studentId("SV002").build();
        invoice.setStudent(otherStudent);

        when(studentRepository.findById("SV001")).thenReturn(Optional.of(student));
        when(tuitionInvoiceRepository.findById(100L)).thenReturn(Optional.of(invoice));

        CreatePaymentCheckoutRequestDto req = CreatePaymentCheckoutRequestDto.builder()
                .invoiceId(100L)
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () -> payOSService.createCheckout("SV001", req));
        assertEquals(ErrorCode.ACCESS_DENIED, ex.getErrorCode());
        verify(paymentTransactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Xử lý Webhook PayOS thành công: cập nhật status PAID và ghi nhận vào sổ cái học phí")
    void processWebhook_success() {
        PaymentTransaction txn = PaymentTransaction.builder()
                .id(1L)
                .student(student)
                .invoice(invoice)
                .orderCode(123456789L)
                .amount(new BigDecimal("4500000.00"))
                .status(PaymentTransactionStatus.PENDING)
                .paymentMethod(PaymentMethod.PAYOS)
                .build();

        when(paymentTransactionRepository.findByOrderCode(123456789L)).thenReturn(Optional.of(txn));
        when(payOSConfig.isConfigured()).thenReturn(false); // Bỏ qua verify signature khi test mock

        Map<String, Object> data = new HashMap<>();
        data.put("orderCode", 123456789L);
        data.put("amount", 4500000);
        data.put("code", "00");
        data.put("desc", "success");
        data.put("reference", "MB12345678");

        Map<String, Object> payload = new HashMap<>();
        payload.put("code", "00");
        payload.put("desc", "success");
        payload.put("data", data);

        Map<String, Object> result = payOSService.processWebhook(payload);

        assertEquals(0, result.get("error"));
        assertEquals(PaymentTransactionStatus.PAID, txn.getStatus());
        assertEquals("MB12345678", txn.getProviderTransactionId());
        assertNotNull(txn.getPaidAt());

        verify(paymentTransactionRepository, times(1)).save(txn);
        verify(tuitionService, times(1)).recordPayment(eq("SV001"), any(TuitionPaymentRequestDto.class));
        verify(emailReceiptService, times(1)).sendPaymentReceipt(eq(student), eq(txn));
    }

    @Test
    @DisplayName("Tính Idempotent của Webhook: Nếu nhận trùng webhook nhiều lần thì không trừ học phí lần 2")
    void processWebhook_idempotent() {
        PaymentTransaction alreadyPaidTxn = PaymentTransaction.builder()
                .id(1L)
                .student(student)
                .invoice(invoice)
                .orderCode(123456789L)
                .amount(new BigDecimal("4500000.00"))
                .status(PaymentTransactionStatus.PAID)
                .paymentMethod(PaymentMethod.PAYOS)
                .build();

        when(paymentTransactionRepository.findByOrderCode(123456789L)).thenReturn(Optional.of(alreadyPaidTxn));
        when(payOSConfig.isConfigured()).thenReturn(false);

        Map<String, Object> data = new HashMap<>();
        data.put("orderCode", 123456789L);
        data.put("code", "00");

        Map<String, Object> payload = new HashMap<>();
        payload.put("code", "00");
        payload.put("data", data);

        Map<String, Object> result = payOSService.processWebhook(payload);

        assertEquals(0, result.get("error"));
        assertEquals("Transaction already processed", result.get("message"));
        verify(tuitionService, never()).recordPayment(any(), any());
    }
}

