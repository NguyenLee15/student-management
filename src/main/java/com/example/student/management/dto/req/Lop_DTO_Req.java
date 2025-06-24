package com.example.student.management.dto.req;

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

public class Lop_DTO_Req {
    @NotBlank(message = "Mã lớp không được để trống")
    @Size(max = 10, message = "Mã lớp không vượt quá 10 ký tự")
    private String maLop;

    @NotBlank(message = "Tên lớp không được để trống")
    @Size(max = 100, message = "Tên lớp không vượt quá 100 ký tự")
    private String tenLop;

    @NotBlank(message = "Mã khoa không được để trống")
    @Size(max = 10, message = "Mã khoa không vượt quá 10 ký tự")
    private String maKhoa;
}
