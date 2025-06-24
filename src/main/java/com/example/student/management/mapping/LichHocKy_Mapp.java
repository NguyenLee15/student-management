package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.LichHocKy_DTO_Req;
import com.example.student.management.dto.req.LichHocKy_UpdateDTO;
import com.example.student.management.dto.resp.LichHocKy_DTO_Resp;
import com.example.student.management.entity.GiangVien;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.LichHocKy;
import com.example.student.management.entity.LopTinChi;
import com.example.student.management.entity.PhongHoc;
import com.example.student.management.entity.SinhVien;

public class LichHocKy_Mapp {
    
    // Create
    public static LichHocKy toEntity(LichHocKy_DTO_Req dto, LopTinChi lopTinChi, HocPhan hp, GiangVien gv, PhongHoc ph) {
        
        if (dto == null) return null;
        LichHocKy entity = new LichHocKy();
        entity.setLopTinChi(lopTinChi);
        entity.setHocPhan(hp);
        entity.setGiangVien(gv);
        entity.setPhongHoc(ph);
        entity.setHocKy(dto.getHocKy());
        entity.setNamHoc(dto.getNamHoc());
        entity.setThoiGianHoc(dto.getThoiGianHoc());
        entity.setCaHoc(dto.getCaHoc());
        entity.setNgayBatDauHoc(dto.getNgayBatDauHoc());
        entity.setNgayKetThucHoc(dto.getNgayKetThucHoc());
        return entity;
    }

    // update
    public static LichHocKy toEntity(LichHocKy_UpdateDTO dto, LopTinChi lopTinChi, SinhVien sv, HocPhan hp, GiangVien gv, PhongHoc ph) {
        
        if (dto == null) return null;
        LichHocKy entity = new LichHocKy();
        entity.setLichHocKyId(dto.getLichHocKyID());
        entity.setLopTinChi(lopTinChi);
        entity.setHocPhan(hp);
        entity.setGiangVien(gv);
        entity.setPhongHoc(ph);
        entity.setHocKy(dto.getHocKy());
        entity.setNamHoc(dto.getNamHoc());
        entity.setThoiGianHoc(dto.getThoiGianHoc());
        entity.setCaHoc(dto.getCaHoc());
        entity.setNgayBatDauHoc(dto.getNgayBatDauHoc());
        entity.setNgayKetThucHoc(dto.getNgayKetThucHoc());
        return entity;
    }

    public static LichHocKy_DTO_Resp toDTOResp(LichHocKy entity) {
        if (entity == null) return null;
        LichHocKy_DTO_Resp resp = new LichHocKy_DTO_Resp();
        resp.setLichHocKyID(entity.getLichHocKyId());
        resp.setLopTinChiId(entity.getLopTinChi().getLopTinChiId());
        resp.setTenLopTinChi(entity.getLopTinChi().getTenLopTinChi());
        resp.setSinhVienList(entity.getLopTinChi().getLopTinChiSinhViens().stream()
                .map(lopTinChiSinhVien -> lopTinChiSinhVien.getSinhVien().getMaSinhVien())
                .collect(Collectors.toList()));
        resp.setMaHocPhan(entity.getHocPhan().getMaHocPhan());
        resp.setTenHocPhan(entity.getHocPhan().getTenHocPhan());
        resp.setMaGiangVien(entity.getGiangVien().getMaGiangVien());
        resp.setTenGiangVien(entity.getGiangVien().getTenGiangVien());
        resp.setMaPhong(entity.getPhongHoc().getMaPhong());
        resp.setTenPhong(entity.getPhongHoc().getTenPhong());
        resp.setHocKy(entity.getHocKy());
        resp.setNamHoc(entity.getNamHoc());
        resp.setThoiGianHoc(entity.getThoiGianHoc());
        resp.setCaHoc(entity.getCaHoc());
        resp.setNgayBatDauHoc(entity.getNgayBatDauHoc());
        resp.setNgayKetThucHoc(entity.getNgayKetThucHoc());
        return resp;
    }

    public static List<LichHocKy_DTO_Resp> toDTORespList(List<LichHocKy> list) {
        return list.stream()
        .map(LichHocKy_Mapp::toDTOResp)
        .collect(Collectors.toList());
    }
}
