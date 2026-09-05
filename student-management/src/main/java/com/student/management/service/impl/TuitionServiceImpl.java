// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.TuitionPaymentRequestDto;
import com.student.management.dto.resp.TuitionInvoiceResponseDto;
import com.student.management.dto.resp.TuitionItemResponseDto;
import com.student.management.dto.resp.TuitionPaymentResponseDto;
import com.student.management.entity.*;
import com.student.management.enums.PaymentMethod;
import com.student.management.enums.TuitionInvoiceStatus;
import com.student.management.enums.TuitionItemStatus;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.*;
import com.student.management.security.SecurityService;
import com.student.management.service.TuitionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TuitionServiceImpl implements TuitionService {

    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final TuitionItemRepository tuitionItemRepository;
    private final SecurityService securityService;

    @Override
    @Transactional(readOnly = true)
    public TuitionInvoiceResponseDto getStudentInvoiceBySemester(String studentId, Long semesterId) {
        TuitionInvoice invoice = tuitionInvoiceRepository.findByStudent_StudentIdAndSemester_Id(studentId, semesterId)
                .orElse(null);
        if (invoice == null) {
            return null;
        }
        return toInvoiceDto(invoice);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TuitionInvoiceResponseDto> getAllStudentInvoices(String studentId) {
        return tuitionInvoiceRepository.findByStudent_StudentIdOrderByDueDateDesc(studentId).stream()
                .map(this::toInvoiceDto)
                .toList();
    }

    @Override
    @Transactional
    public void addCourseEnrollmentToInvoice(Student student, Semester semester, Enrollment enrollment, CreditClass creditClass, BigDecimal unitPrice) {
        TuitionInvoice invoice = tuitionInvoiceRepository.findByStudent_StudentIdAndSemester_Id(student.getStudentId(), semester.getId())
                .orElseGet(() -> {
                    String code = "INV-" + semester.getSemesterCode() + "-" + student.getStudentId();
                    TuitionInvoice newInv = TuitionInvoice.builder()
                            .invoiceCode(code)
                            .student(student)
                            .semester(semester)
                            .totalAmount(BigDecimal.ZERO)
                            .paidAmount(BigDecimal.ZERO)
                            .remainingAmount(BigDecimal.ZERO)
                            .status(TuitionInvoiceStatus.UNPAID)
                            .dueDate(semester.getStartDate().plusMonths(1))
                            .build();
                    return tuitionInvoiceRepository.save(newInv);
                });

        int credits = creditClass.getSubject().getCredits() != null ? creditClass.getSubject().getCredits() : 3;
        BigDecimal amount = unitPrice.multiply(BigDecimal.valueOf(credits));

        TuitionItem item = TuitionItem.builder()
                .invoice(invoice)
                .enrollment(enrollment)
                .creditClass(creditClass)
                .credits(credits)
                .unitPrice(unitPrice)
                .amount(amount)
                .status(TuitionItemStatus.ACTIVE)
                .build();

        invoice.getItems().add(item);
        invoice.recalculateAmounts();
        tuitionInvoiceRepository.save(invoice);

        log.info("TUITION_ITEM_ADDED invoiceId={} studentId={} classId={} credits={} unitPrice={} amount={}",
                invoice.getId(), student.getStudentId(), creditClass.getId(), credits, unitPrice, amount);
    }

    @Override
    @Transactional
    public void cancelCourseFromInvoice(Long enrollmentId) {
        TuitionItem item = tuitionItemRepository.findByEnrollment_Id(enrollmentId).orElse(null);
        if (item != null && item.getStatus() == TuitionItemStatus.ACTIVE) {
            item.setStatus(TuitionItemStatus.CANCELLED);
            tuitionItemRepository.save(item);

            TuitionInvoice invoice = item.getInvoice();
            if (invoice != null) {
                invoice.recalculateAmounts();
                tuitionInvoiceRepository.save(invoice);
                log.info("TUITION_ITEM_CANCELLED invoiceId={} enrollmentId={} refundedAmount={}",
                        invoice.getId(), enrollmentId, item.getAmount());
            }
        }
    }

    @Override
    @Transactional
    public TuitionPaymentResponseDto recordPayment(String studentId, TuitionPaymentRequestDto requestDto) {
        TuitionInvoice invoice = tuitionInvoiceRepository.findById(requestDto.getInvoiceId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy hóa đơn học phí có ID: " + requestDto.getInvoiceId()));

        if (!invoice.getStudent().getStudentId().equals(studentId)) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "Bạn không có quyền thanh toán cho hóa đơn của sinh viên khác.");
        }

        if (securityService != null && securityService.isStudentRole()) {
            if (requestDto.getPaymentMethod() == null || requestDto.getPaymentMethod() != PaymentMethod.PAYOS) {
                throw new BusinessException(ErrorCode.ACCESS_DENIED, "Sinh viên không thể tự xác nhận thanh toán tiền mặt hoặc chuyển khoản thủ công.");
            }
        }

        if (invoice.getStatus() == TuitionInvoiceStatus.PAID || invoice.getRemainingAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Hóa đơn học phí này đã được thanh toán đầy đủ.");
        }

        BigDecimal payAmount = requestDto.getAmount();
        if (payAmount.compareTo(invoice.getRemainingAmount()) > 0) {
            payAmount = invoice.getRemainingAmount(); // Cắt phần vượt nếu nộp dư
        }

        String transactionCode = "TXN-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        TuitionPayment payment = TuitionPayment.builder()
                .transactionCode(transactionCode)
                .invoice(invoice)
                .amount(payAmount)
                .paymentMethod(requestDto.getPaymentMethod() != null ? requestDto.getPaymentMethod() : PaymentMethod.BANK_TRANSFER)
                .paymentTime(LocalDateTime.now())
                .note(requestDto.getNote() != null ? requestDto.getNote() : "Thanh toán học phí trực tuyến")
                .build();

        invoice.getPayments().add(payment);
        invoice.setPaidAmount(invoice.getPaidAmount().add(payAmount));
        invoice.recalculateAmounts();

        tuitionInvoiceRepository.save(invoice);

        log.info("TUITION_PAYMENT_PROCESSED invoiceId={} studentId={} amount={} txnCode={}",
                invoice.getId(), studentId, payAmount, transactionCode);

        return TuitionPaymentResponseDto.builder()
                .id(payment.getId())
                .transactionCode(payment.getTransactionCode())
                .invoiceId(invoice.getId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentMethodName(payment.getPaymentMethod().getDisplayName())
                .paymentTime(payment.getPaymentTime())
                .note(payment.getNote())
                .build();
    }

    private TuitionInvoiceResponseDto toInvoiceDto(TuitionInvoice invoice) {
        List<TuitionItemResponseDto> itemDtos = invoice.getItems() != null ? invoice.getItems().stream()
                .filter(item -> item != null)
                .map(item -> TuitionItemResponseDto.builder()
                        .id(item.getId())
                        .enrollmentId(item.getEnrollment() != null ? item.getEnrollment().getId() : null)
                        .creditClassId(item.getCreditClass() != null ? item.getCreditClass().getId() : null)
                        .classCode(item.getCreditClass() != null ? item.getCreditClass().getClassCode() : null)
                        .subjectId(item.getCreditClass() != null && item.getCreditClass().getSubject() != null ? item.getCreditClass().getSubject().getSubjectId() : null)
                        .subjectName(item.getCreditClass() != null && item.getCreditClass().getSubject() != null ? item.getCreditClass().getSubject().getSubjectName() : null)
                        .credits(item.getCredits())
                        .unitPrice(item.getUnitPrice())
                        .amount(item.getAmount())
                        .status(item.getStatus())
                        .build())
                .toList() : List.of();

        List<TuitionPaymentResponseDto> paymentDtos = invoice.getPayments() != null ? invoice.getPayments().stream()
                .filter(pay -> pay != null)
                .map(pay -> TuitionPaymentResponseDto.builder()
                        .id(pay.getId())
                        .transactionCode(pay.getTransactionCode())
                        .invoiceId(invoice.getId())
                        .amount(pay.getAmount())
                        .paymentMethod(pay.getPaymentMethod())
                        .paymentMethodName(pay.getPaymentMethod() != null ? pay.getPaymentMethod().getDisplayName() : "")
                        .paymentTime(pay.getPaymentTime())
                        .note(pay.getNote())
                        .build())
                .toList() : List.of();

        return TuitionInvoiceResponseDto.builder()
                .id(invoice.getId())
                .invoiceCode(invoice.getInvoiceCode())
                .studentId(invoice.getStudent() != null ? invoice.getStudent().getStudentId() : null)
                .studentName(invoice.getStudent() != null ? invoice.getStudent().getFullName() : "")
                .semesterId(invoice.getSemester() != null ? invoice.getSemester().getId() : null)
                .semesterName(invoice.getSemester() != null ? invoice.getSemester().getName() : "")
                .totalAmount(invoice.getTotalAmount() != null ? invoice.getTotalAmount() : BigDecimal.ZERO)
                .paidAmount(invoice.getPaidAmount() != null ? invoice.getPaidAmount() : BigDecimal.ZERO)
                .remainingAmount(invoice.getRemainingAmount() != null ? invoice.getRemainingAmount() : BigDecimal.ZERO)
                .status(invoice.getStatus())
                .statusName(invoice.getStatus() != null ? invoice.getStatus().getDisplayName() : "")
                .dueDate(invoice.getDueDate())
                .items(itemDtos)
                .payments(paymentDtos)
                .build();
    }
}
