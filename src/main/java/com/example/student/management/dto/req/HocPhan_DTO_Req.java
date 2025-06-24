package com.example.student.management.dto.req;

import com.example.student.management.enums.LoaiHocPhan;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HocPhan_DTO_Req {
    @NotBlank(message = "Mã học phần không được để trống")
    @Size(max = 10, message = "Mã học phần không vượt quá 10 ký tự")
    private String maHocPhan;

    @NotBlank(message = "Tên học phần không được để trống")
    @Size(max = 100, message = "Tên học phần không vượt quá 100 ký tự")
    private String tenHocPhan;

    @NotNull(message = "Loại học phần không được để trống")
    private LoaiHocPhan loaiHocPhan;

    @NotNull(message = "Số tín chỉ không được để trống")
    @Min(value = 1, message = "Số tín chỉ phải lớn hơn 0")
    private Integer soTinChi;

    @NotNull(message = "Số tiền trên mỗi tín chỉ không được để trống")
    @Min(value = 1, message = "Số tiền trên mỗi tín chỉ phải lớn hơn 0")
    private Integer soTienTinChi;

    @NotBlank(message = "Mã khoa không được để trống")
    @Size(max = 10, message = "Mã khoa không vượt quá 10 ký tự")
    private String maKhoa;
}