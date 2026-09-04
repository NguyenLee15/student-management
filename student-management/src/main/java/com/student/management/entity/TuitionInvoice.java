// cSpell:disable
package com.student.management.entity;

import com.student.management.enums.TuitionInvoiceStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tuition_invoices")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TuitionInvoice extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_code", nullable = false, unique = true, length = 50)
    private String invoiceCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Sinh viên là bắt buộc")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    @NotNull(message = "Học kỳ là bắt buộc")
    private Semester semester;

    @Column(name = "total_amount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal totalAmount = BigDecimal.ZERO;

    @Column(name = "paid_amount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal paidAmount = BigDecimal.ZERO;

    @Column(name = "remaining_amount", nullable = false, precision = 12, scale = 2)
    @Builder.Default
    private BigDecimal remainingAmount = BigDecimal.ZERO;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TuitionInvoiceStatus status = TuitionInvoiceStatus.UNPAID;

    @Column(name = "due_date", nullable = false)
    @NotNull(message = "Hạn thanh toán là bắt buộc")
    private LocalDate dueDate;

    @Version
    @Column(name = "version")
    @Builder.Default
    private Long version = 0L;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TuitionItem> items = new ArrayList<>();

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<TuitionPayment> payments = new ArrayList<>();

    public void recalculateAmounts() {
        this.totalAmount = items.stream()
                .filter(item -> com.student.management.enums.TuitionItemStatus.ACTIVE.equals(item.getStatus()))
                .map(TuitionItem::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        this.remainingAmount = totalAmount.subtract(paidAmount);
        if (remainingAmount.compareTo(BigDecimal.ZERO) < 0) {
            remainingAmount = BigDecimal.ZERO;
        }

        if (paidAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.status = TuitionInvoiceStatus.UNPAID;
        } else if (remainingAmount.compareTo(BigDecimal.ZERO) == 0) {
            this.status = TuitionInvoiceStatus.PAID;
        } else {
            this.status = TuitionInvoiceStatus.PARTIALLY_PAID;
        }
    }
}
