package com.example.student.management.dto.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor

public class GiangVien_DTO_Req {
    @NotBlank(message = "Mã giảng viên không được để trống")
    @Size(max = 10, message = "Mã giảng viên không được vượt quá 10 ký tự")
    private String maGiangVien;

    @NotBlank(message = "Tên giảng viên không được để trống")
    @Size(max = 100, message = "Tên giảng viên không được vượt quá 100 ký tự")
    private String tenGiangVien;

    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không vượt quá 100 ký tự")
    private String email;

    @NotBlank(message = "Mã khoa không được để trống")
    @Size(max = 10, message = "Mã khoa không được vượt quá 10 ký tự")
    private String maKhoa;
}
