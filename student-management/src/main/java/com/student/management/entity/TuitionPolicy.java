package com.student.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "tuition_policies")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class TuitionPolicy extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    @NotNull(message = "Học kỳ áp dụng là bắt buộc")
    private Semester semester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id")
    private Faculty faculty; // Nullable: Nếu null nghĩa là áp dụng chung toàn trường

    @Column(name = "unit_price_per_credit", nullable = false, precision = 12, scale = 2)
    @NotNull(message = "Đơn giá trên mỗi tín chỉ là bắt buộc")
    @DecimalMin(value = "0.0", inclusive = false, message = "Đơn giá trên mỗi tín chỉ phải lớn hơn 0")
    private BigDecimal unitPricePerCredit;

    @Column(name = "effective_date", nullable = false)
    @NotNull(message = "Ngày hiệu lực là bắt buộc")
    private LocalDate effectiveDate;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;
}
