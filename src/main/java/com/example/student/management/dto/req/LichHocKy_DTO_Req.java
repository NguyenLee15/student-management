package com.example.student.management.dto.req;

import com.example.student.management.enums.CaHoc;
import com.example.student.management.enums.HocKi;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LichHocKy_DTO_Req {

    private Long lopTinChiId;

    @NotBlank(message = "Mã học phần không được để trống")
    @Size(max = 10, message = "Mã học phần không vượt quá 10 ký tự")
    private String maHocPhan;

    @NotBlank(message = "Mã giảng viên không được để trống")
    @Size(max = 10, message = "Mã giảng viên không vượt quá 10 ký tự")
    private String maGiangVien;

    @NotBlank(message = "Mã phòng không được để trống")
    @Size(max = 10, message = "Mã phòng không vượt quá 10 ký tự")
    private String maPhong;

    @NotNull(message = "Học kỳ không được để trống")
    private HocKi hocKy;

    @NotBlank(message = "Năm học không được để trống")
    @Pattern(regexp = "\\d{4}-\\d{4}", message = "Năm học phải theo định dạng xxxx-yyyy")
    private String namHoc;

    @NotBlank(message = "Thời gian học không được để trống")
    @Size(max = 30, message = "Thời gian học không vượt quá 30 ký tự")
    private String thoiGianHoc;

    @NotNull(message = "Ca học không được để trống")
    private CaHoc caHoc;

    @NotNull(message = "Ngày bắt đầu học không được để trống")
    private LocalDate ngayBatDauHoc;

    @NotNull(message = "Ngày kết thúc học không được để trống")
    private LocalDate ngayKetThucHoc;
}