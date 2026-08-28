// cSpell:disable
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
    @NotNull(message = "Lớp tín chỉ là bắt buộc")
    private CreditClass creditClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subject_id", nullable = false)
    @NotNull(message = "Môn học là bắt buộc")
    private Subject subject;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    @NotNull(message = "Giảng viên là bắt buộc")
    private Teacher teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "classroom_id", nullable = false)
    @NotNull(message = "Phòng học là bắt buộc")
    private Classroom classroom;

    @Enumerated(EnumType.STRING)
    @Column(name = "semester", nullable = false)
    @NotNull(message = "Học kỳ là bắt buộc")
    private Semester semester;

    @Column(name = "academic_year", nullable = false, length = 9)
    @NotBlank(message = "Năm học là bắt buộc")
    private String academicYear;

    @Column(name = "study_time", nullable = false, length = 30)
    @NotBlank(message = "Thời gian học là bắt buộc")
    private String studyTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "class_shift", nullable = false)
    @NotNull(message = "Ca học là bắt buộc")
    private ClassShift classShift;

    @NotNull(message = "Ngày bắt đầu là bắt buộc")
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc là bắt buộc")
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @AssertTrue(message = "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu")
    public boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }
}


