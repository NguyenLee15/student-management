// cSpell:disable
package com.student.management.entity;

import com.student.management.enums.Gender;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "students")
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Student extends BaseEntity {

    @Id
    @Column(name = "student_id", nullable = false, length = 10)
    @NotBlank(message = "Mã sinh viên là bắt buộc")
    @Size(max = 10, message = "Mã sinh viên không được vượt quá 10 ký tự")
    private String studentId;

    @Column(name = "full_name", nullable = false, length = 100)
    @NotBlank(message = "Họ và tên là bắt buộc")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @Column(name = "date_of_birth")
    @Past(message = "Ngày sinh phải ở trong quá khứ")
    private LocalDate dateOfBirth;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false)
    @NotNull(message = "Giới tính là bắt buộc")
    private Gender gender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", nullable = false)
    @NotNull(message = "Lớp học là bắt buộc")
    private StudentClass studentClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", nullable = false)
    @NotNull(message = "Năm học là bắt buộc")
    private AcademicYear academicYear;

    @Column(name = "email", nullable = false, length = 100)
    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;
}


