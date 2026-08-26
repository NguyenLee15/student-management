package com.student.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.math.BigDecimal;

@Entity
@Table(name = "credit_classes")
@SQLRestriction("deleted = false")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreditClass extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "credit_class_id")
    private Long creditClassId;

    @Column(name = "credit_class_name", length = 100)
    private String creditClassName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    @NotNull(message = "Subject is required")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    @NotNull(message = "Teacher is required")
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    @NotNull(message = "Classroom is required")
    private Classroom classroom;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    @NotNull(message = "Academic year is required")
    private AcademicYear academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id")
    private Semester semester;

    @Min(value = 1, message = "Max students must be at least 1")
    @Column(name = "max_students", nullable = false)
    @Builder.Default
    private Integer maxStudents = 40;

    @Column(name = "enrolled_count", nullable = false)
    @Builder.Default
    private Integer enrolledCount = 0;

    @Column(name = "attendance_weight", precision = 3, scale = 2)
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "1.00")
    @Builder.Default
    private BigDecimal attendanceWeight = new BigDecimal("0.10");

    @Column(name = "midterm_weight", precision = 3, scale = 2)
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "1.00")
    @Builder.Default
    private BigDecimal midtermWeight = new BigDecimal("0.30");

    @Column(name = "final_exam_weight", precision = 3, scale = 2)
    @DecimalMin(value = "0.00")
    @DecimalMax(value = "1.00")
    @Builder.Default
    private BigDecimal finalExamWeight = new BigDecimal("0.60");

    @Column(name = "locked", nullable = false)
    @Builder.Default
    private Boolean locked = false;

    @Version
    @Column(name = "version")
    private Long version;

    // Helper methods for clean domain aliases
    public Long getId() {
        return creditClassId;
    }

    public Integer getMaxEnrollment() {
        return maxStudents;
    }

    public void setMaxEnrollment(Integer maxEnrollment) {
        this.maxStudents = maxEnrollment;
    }

    public String getClassCode() {
        return creditClassName != null ? creditClassName : ("CLASS-" + creditClassId);
    }

    public void snapshotWeightsFromSubject() {
        if (subject != null) {
            this.attendanceWeight = subject.getAttendanceWeight();
            this.midtermWeight = subject.getMidtermWeight();
            this.finalExamWeight = subject.getFinalExamWeight();
        }
    }
}
