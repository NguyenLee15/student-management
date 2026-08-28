// cSpell:disable
package com.student.management.entity;

import com.student.management.enums.PaymentMethod;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tuition_payments")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TuitionPayment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_code", nullable = false, unique = true, length = 50)
    private String transactionCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    @NotNull(message = "Hóa đơn là bắt buộc")
    @ToString.Exclude
    private TuitionInvoice invoice;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Số tiền thanh toán là bắt buộc")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_method", nullable = false, length = 30)
    @Builder.Default
    private PaymentMethod paymentMethod = PaymentMethod.BANK_TRANSFER;

    @Column(name = "payment_time", nullable = false)
    @NotNull(message = "Thời gian thanh toán là bắt buộc")
    private LocalDateTime paymentTime;

    @Column(name = "note", length = 255)
    private String note;
}
