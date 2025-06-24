package com.example.student.management.dto.resp;

import com.example.student.management.enums.CaHoc;
import com.example.student.management.enums.HocKi;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LichHocKy_DTO_Resp {

    private Long lichHocKyID;

    private Long lopTinChiId;
    private String tenLopTinChi;
    private List<String> sinhVienList; // Danh sách mã sinh viên

    private String maHocPhan;
    private String tenHocPhan;

    private String maGiangVien;
    private String tenGiangVien;

    private String maPhong;
    private String tenPhong;

    private HocKi hocKy;
    private String namHoc;

    private String thoiGianHoc;
    private CaHoc caHoc;

    private LocalDate ngayBatDauHoc;
    private LocalDate ngayKetThucHoc;
}