package com.example.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Khoa_DTO_Req {
    @NotBlank(message = "Mã khoa không được để trống")
    @Size(max = 10, message = "Mã khoa không được vượt quá 10 ký tự")
    private String maKhoa;

    @NotBlank(message = "Tên khoa không được để trống")
    @Size(max = 100, message = "Tên khoa không được vượt quá 100 ký tự")
    private String tenKhoa;
}
