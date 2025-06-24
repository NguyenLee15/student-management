package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.PhongHoc_DTO_Req;
import com.example.student.management.dto.resp.PhongHoc_DTO_Resp;
import com.example.student.management.entity.PhongHoc;

public class PhongHoc_Mapp {
    public static PhongHoc toEntity(PhongHoc_DTO_Req dto) {
        
        if (dto == null) return null;
        PhongHoc ph = new PhongHoc();
        ph.setMaPhong(dto.getMaPhong());
        ph.setTenPhong(dto.getTenPhong());
        ph.setSucChua(dto.getSucChua());
        ph.setToaNha(dto.getToaNha());
        return ph;
    }

    public static PhongHoc_DTO_Resp toDTOResp(PhongHoc ph) {
        
        if (ph == null) return null;
        PhongHoc_DTO_Resp resp = new PhongHoc_DTO_Resp();
        resp.setMaPhong(ph.getMaPhong());
        resp.setTenPhong(ph.getTenPhong());
        resp.setSucChua(ph.getSucChua());
        resp.setToaNha(ph.getToaNha());
        return resp;
    }

    public static List<PhongHoc_DTO_Resp> toDTORespList(List<PhongHoc> phs) {
        return phs.stream()
        .map(PhongHoc_Mapp::toDTOResp)
        .collect(Collectors.toList());
    }
}
