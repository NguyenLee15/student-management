package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.DiemHocTap_DTO_Req;
import com.example.student.management.dto.req.DiemHocTap_UpdateDTO;
import com.example.student.management.dto.resp.DiemHocTap_DTO_Resp;
import com.example.student.management.entity.DiemHocTap;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.SinhVien;

public class DiemHocTap_Mapp {
    // Create
    public static DiemHocTap toEntity(DiemHocTap_DTO_Req dto, SinhVien sv, HocPhan hp) {
        if (dto == null) return null;
        DiemHocTap entity = new DiemHocTap();
        entity.setSinhVien(sv);
        entity.setHocPhan (hp);
        entity.setHocKy(dto.getHocKy());
        entity.setNamHoc(dto.getNamHoc());
        entity.setDot(dto.getDot());
        entity.setDiemThang10(dto.getDiemThang10());
        entity.setDiemThang4(dto.getDiemThang4());
        entity.setDiemChu(dto.getDiemChu());
        return entity;
    }

    // Update
    public static DiemHocTap toEntityUpdate(DiemHocTap_UpdateDTO dto, SinhVien sv, HocPhan hp) {
        
        if (dto == null) return null;
        DiemHocTap entity = new DiemHocTap();
        entity.setDiemHocTapId(dto.getDiemHocTapID());
        entity.setSinhVien(sv);
        entity.setHocPhan (hp);
        entity.setHocKy(dto.getHocKy());
        entity.setNamHoc(dto.getNamHoc());
        entity.setDot(dto.getDot());
        entity.setDiemThang10(dto.getDiemThang10());
        entity.setDiemThang4(dto.getDiemThang4());
        entity.setDiemChu(dto.getDiemChu());
        return entity;
    }

    public static DiemHocTap_DTO_Resp toDTOResp(DiemHocTap entity) {
        if (entity == null) return null;
        DiemHocTap_DTO_Resp resp = new DiemHocTap_DTO_Resp();
        resp.setDiemHocTapID(entity.getDiemHocTapId());
        resp.setMaSV(entity.getSinhVien().getMaSinhVien());
        resp.setTenSV(entity.getSinhVien().getHoVaTen()); // Thêm tên sinh viên
        resp.setMaHocPhan(entity.getHocPhan().getMaHocPhan());
        resp.setTenHocPhan(entity.getHocPhan().getTenHocPhan()); // Thêm tên học phần
        resp.setHocKy(entity.getHocKy());
        resp.setNamHoc(entity.getNamHoc());
        resp.setDot(entity.getDot());
        resp.setDiemThang10(entity.getDiemThang10());
        resp.setDiemThang4(entity.getDiemThang4());
        resp.setDiemChu(entity.getDiemChu());
        return resp;
    }

    public static List<DiemHocTap_DTO_Resp> toDTORespList(List<DiemHocTap> list) {
        return list.stream().map(DiemHocTap_Mapp::toDTOResp).collect(Collectors.toList());
    }

}
