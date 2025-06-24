package com.example.student.management.dto.req;

import java.time.LocalDate;

import com.example.student.management.enums.GioiTinh;

import jakarta.validation.constraints.Email;
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
public class SinhVien_DTO_Req {
    @NotBlank(message = "Mã sinh viên không được để trống")
    @Size(max = 10, message = "Mã sinh viên không vượt quá 10 ký tự")
    private String maSV;

    @NotBlank(message = "Họ và tên không được để trống")
    @Size(max = 100, message = "Họ và tên không vượt quá 100 ký tự")
    private String hoVaTen;

    private LocalDate ngaySinh;  

    @NotNull(message = "Giới tính không được để trống")
    private GioiTinh gioiTinh;

    @NotBlank(message = "Mã lớp không được để trống")
    @Size(max = 10, message = "Mã lớp không vượt quá 10 ký tự")
    private String maLop;  

    @NotBlank(message = "Mã khóa học không được để trống")
    @Size(max = 9, message = "Mã khóa học không vượt quá 9 ký tự")
    private String maKhoaHoc; 

    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email không vượt quá 100 ký tự")
    private String email; 
}
