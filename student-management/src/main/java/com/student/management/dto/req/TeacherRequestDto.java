// cSpell:disable
package com.student.management.dto.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeacherRequestDto {

    @NotBlank(message = "Mã giảng viên không được để trống")
    @Size(max = 10, message = "Mã giảng viên không được vượt quá 10 ký tự")
    private String teacherId;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;

    @NotBlank(message = "Mã khoa không được để trống")
    private String facultyId;
}

