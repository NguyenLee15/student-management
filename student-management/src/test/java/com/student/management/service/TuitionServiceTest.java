package com.student.management.service;

import com.student.management.dto.req.TuitionPaymentRequestDto;
import com.student.management.dto.resp.TuitionPaymentResponseDto;
import com.student.management.entity.*;
import com.student.management.enums.EnrollmentStatus;
import com.student.management.enums.PaymentMethod;
import com.student.management.enums.TuitionInvoiceStatus;
import com.student.management.enums.TuitionItemStatus;
import com.student.management.repository.*;
import com.student.management.repository.TuitionInvoiceRepository;
import com.student.management.repository.TuitionItemRepository;
import com.student.management.security.SecurityService;
import com.student.management.service.impl.TuitionServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TuitionServiceTest {

    @Mock
    private TuitionInvoiceRepository tuitionInvoiceRepository;

    @Mock
    private TuitionItemRepository tuitionItemRepository;

    @Mock
    private SecurityService securityService;

    @InjectMocks
    private TuitionServiceImpl tuitionService;

    private Student sampleStudent;
    private Semester sampleSemester;
    private CreditClass sampleClass;
    private Enrollment sampleEnrollment;
    private TuitionInvoice sampleInvoice;

    @BeforeEach
    void setUp() {
        sampleStudent = Student.builder()
                .studentId("SV001")
                .fullName("Nguyễn Văn A")
                .build();

        sampleSemester = Semester.builder()
                .id(1L)
                .name("Học kỳ 1 2026-2027")
                .semesterCode("20261")
                .startDate(LocalDate.of(2026, 9, 1))
                .build();

        Subject subject = Subject.builder()
                .subjectId("CS101")
                .subjectName("Lập trình Java")
                .credits(3)
                .build();

        sampleClass = CreditClass.builder()
                .creditClassId(101L)
                .creditClassName("Lớp Java 01")
                .subject(subject)
                .semester(sampleSemester)
                .build();

        sampleEnrollment = Enrollment.builder()
                .id(501L)
                .student(sampleStudent)
                .creditClass(sampleClass)
                .semester(sampleSemester)
                .enrollmentDate(LocalDateTime.now())
                .status(EnrollmentStatus.ENROLLED)
                .build();

        sampleInvoice = TuitionInvoice.builder()
                .id(1001L)
                .invoiceCode("INV-20261-SV001")
                .student(sampleStudent)
                .semester(sampleSemester)
                .totalAmount(BigDecimal.ZERO)
                .paidAmount(BigDecimal.ZERO)
                .remainingAmount(BigDecimal.ZERO)
                .status(TuitionInvoiceStatus.UNPAID)
                .dueDate(LocalDate.of(2026, 10, 1))
                .items(new ArrayList<>())
                .payments(new ArrayList<>())
                .build();
    }

    @Test
    @DisplayName("Thêm môn học vào hóa đơn: Tính đúng 3 tín chỉ * 450,000 = 1,350,000 VNĐ")
    void testAddCourseEnrollmentToInvoice() {
        when(tuitionInvoiceRepository.findByStudent_StudentIdAndSemester_Id("SV001", 1L))
                .thenReturn(Optional.of(sampleInvoice));

        tuitionService.addCourseEnrollmentToInvoice(
                sampleStudent, sampleSemester, sampleEnrollment, sampleClass, new BigDecimal("450000.00"));

        assertEquals(1, sampleInvoice.getItems().size());
        assertEquals(new BigDecimal("1350000.00"), sampleInvoice.getTotalAmount());
        assertEquals(new BigDecimal("1350000.00"), sampleInvoice.getRemainingAmount());
        assertEquals(TuitionInvoiceStatus.UNPAID, sampleInvoice.getStatus());
        verify(tuitionInvoiceRepository, times(1)).save(sampleInvoice);
    }

    @Test
    @DisplayName("Hủy môn học (Rút môn): Hủy dòng TuitionItem và giảm công nợ hóa đơn")
    void testCancelCourseFromInvoice() {
        TuitionItem item = TuitionItem.builder()
                .id(201L)
                .invoice(sampleInvoice)
                .enrollment(sampleEnrollment)
                .creditClass(sampleClass)
                .credits(3)
                .unitPrice(new BigDecimal("450000.00"))
                .amount(new BigDecimal("1350000.00"))
                .status(TuitionItemStatus.ACTIVE)
                .build();

        sampleInvoice.getItems().add(item);
        sampleInvoice.recalculateAmounts();

        when(tuitionItemRepository.findByEnrollment_Id(501L)).thenReturn(Optional.of(item));

        tuitionService.cancelCourseFromInvoice(501L);

        assertEquals(TuitionItemStatus.CANCELLED, item.getStatus());
        assertEquals(BigDecimal.ZERO, sampleInvoice.getTotalAmount());
        assertEquals(BigDecimal.ZERO, sampleInvoice.getRemainingAmount());
        verify(tuitionItemRepository, times(1)).save(item);
        verify(tuitionInvoiceRepository, times(1)).save(sampleInvoice);
    }

    @Test
    @DisplayName("Thanh toán học phí thành công: Cập nhật số tiền đã nộp và đổi trạng thái PAID")
    void testRecordPaymentSuccess() {
        sampleInvoice.setTotalAmount(new BigDecimal("1350000.00"));
        sampleInvoice.setRemainingAmount(new BigDecimal("1350000.00"));

        when(tuitionInvoiceRepository.findById(1001L)).thenReturn(Optional.of(sampleInvoice));

        TuitionPaymentRequestDto paymentRequest = TuitionPaymentRequestDto.builder()
                .invoiceId(1001L)
                .amount(new BigDecimal("1350000.00"))
                .paymentMethod(PaymentMethod.VNPAY)
                .note("Thanh toán toàn bộ")
                .build();

        TuitionPaymentResponseDto response = tuitionService.recordPayment("SV001", paymentRequest);

        assertNotNull(response);
        assertEquals(new BigDecimal("1350000.00"), response.getAmount());
        assertEquals(PaymentMethod.VNPAY, response.getPaymentMethod());
        assertEquals(new BigDecimal("1350000.00"), sampleInvoice.getPaidAmount());
        assertEquals(BigDecimal.ZERO, sampleInvoice.getRemainingAmount());
        assertEquals(TuitionInvoiceStatus.PAID, sampleInvoice.getStatus());
    }
    @Test
    @DisplayName("Chống gian lận học phí: Sinh viên không được tự gạch nợ tiền mặt hoặc chuyển khoản thủ công")
    void testRecordPayment_studentRole_cannotPayCash_throwsAccessDenied() {
        sampleInvoice.setTotalAmount(new BigDecimal("1350000.00"));
        sampleInvoice.setRemainingAmount(new BigDecimal("1350000.00"));

        when(tuitionInvoiceRepository.findById(1001L)).thenReturn(Optional.of(sampleInvoice));
        when(securityService.isStudentRole()).thenReturn(true);

        TuitionPaymentRequestDto paymentRequest = TuitionPaymentRequestDto.builder()
                .invoiceId(1001L)
                .amount(new BigDecimal("1350000.00"))
                .paymentMethod(PaymentMethod.CASH)
                .note("Tự nộp tiền mặt")
                .build();

        com.student.management.exception.BusinessException ex = assertThrows(
                com.student.management.exception.BusinessException.class,
                () -> tuitionService.recordPayment("SV001", paymentRequest)
        );

        assertEquals(com.student.management.exception.ErrorCode.ACCESS_DENIED, ex.getErrorCode());
        assertEquals(BigDecimal.ZERO, sampleInvoice.getPaidAmount());
        assertNotEquals(TuitionInvoiceStatus.PAID, sampleInvoice.getStatus());
    }
}
