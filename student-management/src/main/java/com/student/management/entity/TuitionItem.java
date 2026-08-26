package com.student.management.entity;

import com.student.management.enums.TuitionItemStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "tuition_items")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TuitionItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    @NotNull(message = "Hóa đơn học phí là bắt buộc")
    @ToString.Exclude
    private TuitionInvoice invoice;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    @NotNull(message = "Phiếu đăng ký môn học là bắt buộc")
    private Enrollment enrollment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_class_id", nullable = false)
    @NotNull(message = "Lớp học phần là bắt buộc")
    private CreditClass creditClass;

    @Column(name = "credits", nullable = false)
    private Integer credits;

    @Column(name = "unit_price", nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice;

    @Column(name = "amount", nullable = false, precision = 12, scale = 2)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private TuitionItemStatus status = TuitionItemStatus.ACTIVE;
}
