package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.HocPhan_DTO_Req;
import com.example.student.management.dto.resp.HocPhan_DTO_Resp;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.Khoa;

public class HocPhan_Mapp {
    public static HocPhan toEntity(HocPhan_DTO_Req dto, Khoa khoa) {
        if (dto == null) return null;
        HocPhan hp = new HocPhan();
        hp.setMaHocPhan(dto.getMaHocPhan());
        hp.setTenHocPhan(dto.getTenHocPhan());
        hp.setLoaiHocPhan(dto.getLoaiHocPhan());
        hp.setSoTinChi(dto.getSoTinChi());
        hp.setSoTienTinChi(dto.getSoTienTinChi());
        hp.setKhoa(khoa);
        return hp;
    }

    public static HocPhan_DTO_Resp toDTOResp(HocPhan hp) {
        if (hp == null) return null;
        HocPhan_DTO_Resp resp = new HocPhan_DTO_Resp();
        resp.setMaHocPhan(hp.getMaHocPhan());
        resp.setTenHocPhan(hp.getTenHocPhan());
        resp.setLoaiHocPhan(hp.getLoaiHocPhan());
        resp.setSoTinChi(hp.getSoTinChi());
        resp.setSoTienTinChi(hp.getSoTienTinChi());
        resp.setMaKhoa(hp.getKhoa().getMaKhoa());
        resp.setTenKhoa(hp.getKhoa().getTenKhoa());
        return resp;
    }

    public static List<HocPhan_DTO_Resp> toDTORespList(List<HocPhan> hps) {
        return hps.stream()
                .map(HocPhan_Mapp::toDTOResp)
                .collect(Collectors.toList());
    }
}