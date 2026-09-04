// cSpell:disable
package com.student.management.config.seeders;

import com.student.management.entity.*;
import com.student.management.enums.PaymentMethod;
import com.student.management.enums.PaymentTransactionStatus;
import com.student.management.enums.TuitionInvoiceStatus;
import com.student.management.enums.TuitionItemStatus;
import com.student.management.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class TuitionAndPaymentSeeder {

    private final TuitionInvoiceRepository tuitionInvoiceRepository;
    private final TuitionItemRepository tuitionItemRepository;
    private final TuitionPaymentRepository tuitionPaymentRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final StudentRepository studentRepository;
    private final SemesterRepository semesterRepository;
    private final EnrollmentRepository enrollmentRepository;

    public void seedTuitionAndPayments() {
        if (tuitionInvoiceRepository.count() == 0) {
            Semester sem20261 = semesterRepository.findBySemesterCode("20261").orElse(null);
            if (sem20261 == null) return;

            seedStudentInvoice("SV001", sem20261, new BigDecimal("500000.00"), new BigDecimal("2000000.00"),
                    "INV-20261-SV001", "PAY-20261-SV001-01", 1712001L);

            seedStudentInvoice("SV002", sem20261, new BigDecimal("500000.00"), new BigDecimal("3500000.00"),
                    "INV-20261-SV002", "PAY-20261-SV002-01", 1712002L);

            seedStudentInvoice("SV004", sem20261, new BigDecimal("450000.00"), BigDecimal.ZERO,
                    "INV-20261-SV004", null, null);

            log.info("Tuition and Payment seeding completed successfully.");
        }
    }

    private void seedStudentInvoice(String studentId, Semester semester, BigDecimal unitPrice, BigDecimal paidAmount,
                                    String invoiceCode, String paymentCode, Long orderCode) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return;

        List<Enrollment> enrollments = enrollmentRepository.findActiveEnrollmentsByStudentAndSemester(studentId, semester.getId());
        if (enrollments.isEmpty()) return;

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (Enrollment e : enrollments) {
            int credits = e.getCreditClass().getSubject().getCredits();
            totalAmount = totalAmount.add(unitPrice.multiply(BigDecimal.valueOf(credits)));
        }

        BigDecimal remaining = totalAmount.subtract(paidAmount);
        if (remaining.compareTo(BigDecimal.ZERO) < 0) remaining = BigDecimal.ZERO;

        TuitionInvoiceStatus status;
        if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {
            status = TuitionInvoiceStatus.UNPAID;
        } else if (remaining.compareTo(BigDecimal.ZERO) == 0) {
            status = TuitionInvoiceStatus.PAID;
        } else {
            status = TuitionInvoiceStatus.PARTIALLY_PAID;
        }

        TuitionInvoice invoice = tuitionInvoiceRepository.save(TuitionInvoice.builder()
                .invoiceCode(invoiceCode)
                .student(student)
                .semester(semester)
                .totalAmount(totalAmount)
                .paidAmount(paidAmount)
                .remainingAmount(remaining)
                .status(status)
                .dueDate(LocalDate.now().plusDays(30))
                .build());

        // Create tuition items
        for (Enrollment e : enrollments) {
            int credits = e.getCreditClass().getSubject().getCredits();
            BigDecimal itemAmount = unitPrice.multiply(BigDecimal.valueOf(credits));

            tuitionItemRepository.save(TuitionItem.builder()
                    .invoice(invoice)
                    .enrollment(e)
                    .creditClass(e.getCreditClass())
                    .credits(credits)
                    .unitPrice(unitPrice)
                    .amount(itemAmount)
                    .status(TuitionItemStatus.ACTIVE)
                    .build());
        }

        // Record payment & transaction if paid
        if (paidAmount.compareTo(BigDecimal.ZERO) > 0 && paymentCode != null && orderCode != null) {
            tuitionPaymentRepository.save(TuitionPayment.builder()
                    .transactionCode(paymentCode)
                    .invoice(invoice)
                    .amount(paidAmount)
                    .paymentMethod(PaymentMethod.PAYOS)
                    .paymentTime(LocalDateTime.now().minusDays(1))
                    .note("Thanh toán học phí qua cổng PayOS (VietQR)")
                    .build());

            paymentTransactionRepository.save(PaymentTransaction.builder()
                    .orderCode(orderCode)
                    .student(student)
                    .invoice(invoice)
                    .amount(paidAmount)
                    .status(PaymentTransactionStatus.PAID)
                    .paymentMethod(PaymentMethod.PAYOS)
                    .providerTransactionId("POS_TX_" + orderCode)
                    .paidAt(LocalDateTime.now().minusDays(1))
                    .build());
        }
    }
}

