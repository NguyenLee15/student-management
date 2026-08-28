// cSpell:disable
package com.student.management.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teachers")
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Teacher extends BaseEntity {

    @Id
    @Column(name = "teacher_id", nullable = false, length = 10)
    @NotBlank(message = "Mã giảng viên là bắt buộc")
    @Size(max = 10, message = "Mã giảng viên không được vượt quá 10 ký tự")
    private String teacherId;

    @Column(name = "full_name", nullable = false, length = 100)
    @NotBlank(message = "Tên giảng viên là bắt buộc")
    @Size(max = 100, message = "Tên giảng viên không được vượt quá 100 ký tự")
    private String fullName;

    @Column(name = "email", nullable = false, length = 100)
    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @NotNull(message = "Khoa là bắt buộc")
    private Faculty faculty;
}


