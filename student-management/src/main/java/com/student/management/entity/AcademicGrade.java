package com.student.management.entity;

import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "academic_grades")
@SQLRestriction("deleted = false")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicGrade extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "grade_id")
    private Integer gradeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Student is required")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    @NotNull(message = "Subject is required")
    private Subject subject;

    @Enumerated(EnumType.STRING)
    @Column(name = "semester", nullable = false)
    @NotNull(message = "Semester is required")
    private Semester semester;

    @Column(name = "academic_year", nullable = false, length = 9)
    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @Enumerated(EnumType.STRING)
    @Column(name = "study_phase", nullable = false)
    @NotNull(message = "Study phase is required")
    private StudyPhase studyPhase;

    @Column(name = "attempt_number", nullable = false)
    @Builder.Default
    private Integer attemptNumber = 1;

    @DecimalMin(value = "0.0", inclusive = true, message = "Scale 10 score must be >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Scale 10 score must be <= 10")
    @Column(name = "score_scale_10", precision = 3, scale = 1)
    private BigDecimal scoreScale10;

    @DecimalMin(value = "0.0", inclusive = true, message = "Scale 4 score must be >= 0")
    @DecimalMax(value = "4.0", inclusive = true, message = "Scale 4 score must be <= 4")
    @Column(name = "score_scale_4", precision = 3, scale = 1)
    private BigDecimal scoreScale4;

    @Column(name = "letter_grade", nullable = false, length = 5)
    private String letterGrade;
}
