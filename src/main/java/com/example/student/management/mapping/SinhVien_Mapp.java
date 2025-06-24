package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;
import com.example.student.management.dto.req.SinhVien_DTO_Req;
import com.example.student.management.dto.resp.SinhVien_DTO_Resp;
import com.example.student.management.entity.KhoaHoc;
import com.example.student.management.entity.Lop;
import com.example.student.management.entity.SinhVien;

public class SinhVien_Mapp {
    public static SinhVien toEntity(SinhVien_DTO_Req dto, Lop lop, KhoaHoc khoaHoc) {
        if (dto == null) return null;
        SinhVien sv = new SinhVien();
        sv.setMaSinhVien(dto.getMaSV());
        sv.setHoVaTen(dto.getHoVaTen());
        sv.setNgaySinh(dto.getNgaySinh());
        sv.setGioiTinh(dto.getGioiTinh());
        sv.setLop(lop);
        sv.setKhoaHoc(khoaHoc);
        sv.setEmail(dto.getEmail());
        return sv;
    }

    public static SinhVien_DTO_Resp toDTOResp(SinhVien sv) {
        if (sv == null) return null;
        SinhVien_DTO_Resp resp = new SinhVien_DTO_Resp();
        resp.setMaSV(sv.getMaSinhVien());
        resp.setHoVaTen(sv.getHoVaTen());
        resp.setNgaySinh(sv.getNgaySinh());
        resp.setGioiTinh(sv.getGioiTinh());
        resp.setEmail(sv.getEmail());
        resp.setMaLop(sv.getLop() != null ? sv.getLop().getMaLop() : null);
        resp.setMaKhoaHoc(sv.getKhoaHoc() != null ? sv.getKhoaHoc().getMaKhoaHoc() : null);
        return resp;
    }

    public static List<SinhVien_DTO_Resp> toDTORespList(List<SinhVien> svs) {
        return svs.stream()
                .map(SinhVien_Mapp::toDTOResp)
                .collect(Collectors.toList());
    }
}