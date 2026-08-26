package com.student.management.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDate;

@Entity
@Table(name = "semesters")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class Semester extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    @NotBlank(message = "Tên học kỳ là bắt buộc")
    @Size(max = 100, message = "Tên học kỳ không được vượt quá 100 ký tự")
    private String name;

    @Column(name = "semester_code", nullable = false, unique = true, length = 20)
    @NotBlank(message = "Mã học kỳ là bắt buộc")
    @Size(max = 20, message = "Mã học kỳ không được vượt quá 20 ký tự")
    private String semesterCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    @NotNull(message = "Niên khóa / Năm học là bắt buộc")
    private AcademicYear academicYear;

    @Column(name = "start_date", nullable = false)
    @NotNull(message = "Ngày bắt đầu học kỳ là bắt buộc")
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    @NotNull(message = "Ngày kết thúc học kỳ là bắt buộc")
    private LocalDate endDate;

    @Column(name = "active", nullable = false)
    @Builder.Default
    private Boolean active = true;
}
