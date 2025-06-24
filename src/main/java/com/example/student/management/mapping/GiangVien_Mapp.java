package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.GiangVien_DTO_Req;
import com.example.student.management.dto.resp.GiangVien_DTO_Resp;
import com.example.student.management.entity.GiangVien;
import com.example.student.management.entity.Khoa;

public class GiangVien_Mapp {
    public static GiangVien toEntity(GiangVien_DTO_Req dto, Khoa khoa) {
        
        if (dto == null) return null;
        GiangVien gv = new GiangVien();
        gv.setMaGiangVien(dto.getMaGiangVien());
        gv.setTenGiangVien(dto.getTenGiangVien());
        gv.setEmail(dto.getEmail());
        gv.setKhoa(khoa);
        return gv;
    }

    public static GiangVien_DTO_Resp toDTOResp(GiangVien gv) {
        
        if (gv == null) return null;
        GiangVien_DTO_Resp resp = new GiangVien_DTO_Resp();
        resp.setMaGiangVien(gv.getMaGiangVien());
        resp.setTenGiangVien(gv.getTenGiangVien());
        resp.setEmail(gv.getEmail());
        resp.setMaKhoa(gv.getKhoa().getMaKhoa());
        resp.setTenKhoa(gv.getKhoa().getTenKhoa());
        return resp;
    }

    public static List<GiangVien_DTO_Resp> toDTORespList(List<GiangVien> gvs) {
        return gvs.stream()
        .map(GiangVien_Mapp::toDTOResp)
        .collect(Collectors.toList());
    }
}
