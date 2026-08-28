package com.student.management.entity;

import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import jakarta.persistence.*;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "semester_schedules", 
       uniqueConstraints = @UniqueConstraint(
           columnNames = {"credit_class_id", "subject_id", "semester", "academic_year", "teacher_id", "room_id", "class_shift"}))
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SemesterSchedule extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "schedule_id")
    private Long scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_class_id", nullable = false)
    @NotNull(message = "Credit class is required")
    private CreditClass creditClass;

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

    @Enumerated(EnumType.STRING)
    @Column(name = "semester", nullable = false)
    @NotNull(message = "Semester is required")
    private Semester semester;

    @Column(name = "academic_year", nullable = false, length = 9)
    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @Column(name = "study_time", nullable = false, length = 30)
    @NotBlank(message = "Study time is required")
    private String studyTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "class_shift", nullable = false)
    @NotNull(message = "Class shift is required")
    private ClassShift classShift;

    @NotNull(message = "Start date is required")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @AssertTrue(message = "End date must be after or equal to start date")
    public boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }
}


