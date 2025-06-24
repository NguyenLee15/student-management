package com.example.student.management.dto.req;

import jakarta.validation.constraints.Min;
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
public class KhoaHoc_DTO_Req {
    @NotBlank(message = "Mã khóa học không được để trống")
    @Size(max = 9, message = "Mã khóa học không được vượt quá 9 ký tự")
    private String maKhoaHoc;

    @Min(value = 2000, message = "Năm bắt đầu không hợp lệ")
    private Integer namBatDau;

    @Min(value = 2000, message = "Năm kết thúc không hợp lệ")
    private Integer namKetThuc;
}
