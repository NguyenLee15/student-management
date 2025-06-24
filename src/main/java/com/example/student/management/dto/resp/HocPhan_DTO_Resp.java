package com.example.student.management.dto.resp;

import com.example.student.management.enums.LoaiHocPhan;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class HocPhan_DTO_Resp {
    private String maHocPhan;
    private String tenHocPhan;
    private LoaiHocPhan loaiHocPhan;
    private Integer soTinChi;
    private Integer soTienTinChi;
    private String maKhoa;
    private String tenKhoa;
}