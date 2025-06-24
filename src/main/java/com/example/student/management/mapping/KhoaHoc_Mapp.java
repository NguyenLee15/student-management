package com.example.student.management.mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.KhoaHoc_DTO_Req;
import com.example.student.management.dto.resp.KhoaHoc_DTO_Resp;
import com.example.student.management.entity.KhoaHoc;

public class KhoaHoc_Mapp {
    public static KhoaHoc toEntity (KhoaHoc_DTO_Req dto){
        if (dto == null) return null;

        KhoaHoc khoahoc = new KhoaHoc();
        khoahoc.setMaKhoaHoc(dto.getMaKhoaHoc());
        khoahoc.setNamBatDau(dto.getNamBatDau());
        khoahoc.setNamKetThuc(dto.getNamKetThuc());

        return khoahoc;
        
    }

    public static KhoaHoc_DTO_Resp toDTOResp (KhoaHoc kh){
        if (kh == null ) return null;

        KhoaHoc_DTO_Resp dto = new KhoaHoc_DTO_Resp();
        dto.setMaKhoaHoc(kh.getMaKhoaHoc());
        dto.setNamBatDau(kh.getNamBatDau());
        dto.setNamKetThuc(kh.getNamKetThuc());

        return dto ; 
    }

     // Mapping danh sách Entity -> danh sách ResponseDTO
    public List<KhoaHoc_DTO_Resp> toResponseDTOs(List<KhoaHoc> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream()
                .map(KhoaHoc_Mapp::toDTOResp)
                .collect(Collectors.toList());
    }
}
