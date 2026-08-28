// cSpell:disable
package com.student.management.dto.req;

import com.student.management.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequestDto {

    @NotBlank(message = "Mã sinh viên không được để trống")
    @Size(max = 10, message = "Mã sinh viên không được vượt quá 10 ký tự")
    private String studentId;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không được vượt quá 100 ký tự")
    private String fullName;

    @Past(message = "Ngày sinh phải ở trong quá khứ")
    private LocalDate dateOfBirth;

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    @NotBlank(message = "Mã lớp không được để trống")
    private String classId;

    @NotBlank(message = "Mã năm học không được để trống")
    private String academicYearId;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
}

