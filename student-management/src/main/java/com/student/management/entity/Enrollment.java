package com.student.management.entity;

import com.student.management.enums.EnrollmentStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Entity
@Table(name = "enrollments")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class Enrollment extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @NotNull(message = "Sinh viên là bắt buộc")
    private Student student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "credit_class_id", nullable = false)
    @NotNull(message = "Lớp học phần là bắt buộc")
    private CreditClass creditClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", nullable = false)
    @NotNull(message = "Học kỳ là bắt buộc")
    private Semester semester;

    @Column(name = "enrollment_date", nullable = false)
    @NotNull(message = "Thời gian đăng ký là bắt buộc")
    private LocalDateTime enrollmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private EnrollmentStatus status = EnrollmentStatus.ENROLLED;

    @Column(name = "drop_date")
    private LocalDateTime dropDate;
}
