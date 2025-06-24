package com.example.student.management.dto.req;

import java.math.BigDecimal;

import com.example.student.management.enums.Dot;
import com.example.student.management.enums.HocKi;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DiemHocTap_UpdateDTO {
    @NotNull(message = "ID điểm học tập không được để trống")
    private Integer diemHocTapID;

    @NotBlank(message = "Mã sinh viên không được để trống")
    @Size(max = 10, message = "Mã sinh viên không vượt quá 10 ký tự")
    private String maSV;

    @NotBlank(message = "Mã học phần không được để trống")
    @Size(max = 10, message = "Mã học phần không vượt quá 10 ký tự")
    private String maHocPhan;

    @NotNull(message = "Học kỳ không được để trống")
    private HocKi hocKy;

    @NotBlank(message = "Năm học không được để trống")
    @Pattern(regexp = "\\d{4}-\\d{4}", message = "Năm học phải theo định dạng xxxx-yyyy")
    private String namHoc;

    @NotNull(message = "Đợt không được để trống")
    private Dot dot;

    @DecimalMin(value = "0.0", inclusive = true, message = "Điểm thang 10 phải từ 0 đến 10")
    @DecimalMax(value = "10.0", inclusive = true, message = "Điểm thang 10 phải từ 0 đến 10")
    private BigDecimal diemThang10;

    @DecimalMin(value = "0.0", inclusive = true, message = "Điểm thang 4 phải từ 0 đến 4")
    @DecimalMax(value = "4.0", inclusive = true, message = "Điểm thang 4 phải từ 0 đến 4")
    private BigDecimal diemThang4;

    private String diemChu;
}
