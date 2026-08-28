// cSpell:disable
package com.student.management.entity;

import com.student.management.enums.SubjectType;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "subjects")
@SQLRestriction("deleted = false")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Subject extends BaseEntity {

    @Id
    @Column(name = "subject_id", nullable = false, length = 10)
    @NotBlank(message = "Subject ID is required")
    @Size(max = 10, message = "Subject ID cannot exceed 10 characters")
    private String subjectId;

    @Column(name = "subject_name", nullable = false, length = 100)
    @NotBlank(message = "Subject name is required")
    @Size(max = 100, message = "Subject name cannot exceed 100 characters")
    private String subjectName;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false)
    @NotNull(message = "Subject type is required")
    private SubjectType subjectType;

    @Min(value = 1, message = "Tuition per credit must be greater than 0")
    @Column(name = "tuition_per_credit", nullable = false)
    @Builder.Default
    private Integer tuitionPerCredit = 450000;

    @Min(value = 1, message = "Credits must be greater than 0")
    @Column(name = "credits", nullable = false)
    private Integer credits;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @NotNull(message = "Faculty is required")
    private Faculty faculty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "prerequisite_subject_id")
    private Subject prerequisiteSubject;

    @Column(name = "attendance_weight", nullable = false, precision = 3, scale = 2)
    @NotNull(message = "Trọng số điểm chuyên cần là bắt buộc")
    @DecimalMin(value = "0.00", message = "Trọng số không được âm")
    @DecimalMax(value = "1.00", message = "Trọng số không được vượt quá 1.00")
    @Builder.Default
    private BigDecimal attendanceWeight = new BigDecimal("0.10");

    @Column(name = "midterm_weight", nullable = false, precision = 3, scale = 2)
    @NotNull(message = "Trọng số điểm giữa kỳ là bắt buộc")
    @DecimalMin(value = "0.00", message = "Trọng số không được âm")
    @DecimalMax(value = "1.00", message = "Trọng số không được vượt quá 1.00")
    @Builder.Default
    private BigDecimal midtermWeight = new BigDecimal("0.30");

    @Column(name = "final_exam_weight", nullable = false, precision = 3, scale = 2)
    @NotNull(message = "Trọng số điểm cuối kỳ là bắt buộc")
    @DecimalMin(value = "0.00", message = "Trọng số không được âm")
    @DecimalMax(value = "1.00", message = "Trọng số không được vượt quá 1.00")
    @Builder.Default
    private BigDecimal finalExamWeight = new BigDecimal("0.60");

    @PrePersist
    @PreUpdate
    public void validateGradeWeights() {
        if (attendanceWeight == null || midtermWeight == null || finalExamWeight == null) {
            return;
        }
        BigDecimal sum = attendanceWeight.add(midtermWeight).add(finalExamWeight);
        if (sum.compareTo(new BigDecimal("1.00")) != 0) {
            throw new BusinessException(ErrorCode.INVALID_GRADE_WEIGHT_SUM, 
                "Tổng trọng số điểm (Chuyên cần + Giữa kỳ + Cuối kỳ) phải bằng đúng 1.00. Hiện tại: " + sum);
        }
    }
}
