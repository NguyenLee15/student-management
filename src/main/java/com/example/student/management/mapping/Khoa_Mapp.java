package com.example.student.management.mapping;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.Khoa_DTO_Req;
import com.example.student.management.dto.resp.Khoa_DTO_Resp;
import com.example.student.management.entity.Khoa;

public class Khoa_Mapp {

    public static Khoa toEntity (Khoa_DTO_Req dto){
        if (dto == null) return null;

        Khoa khoa = new Khoa();
        khoa.setMaKhoa(dto.getMaKhoa());
        khoa.setTenKhoa(dto.getTenKhoa());
        return khoa;
    }

    public static Khoa_DTO_Resp toDTOResp (Khoa khoa){
        if (khoa == null) return null;
        
        Khoa_DTO_Resp dto = new Khoa_DTO_Resp();
        dto.setMaKhoa(khoa.getMaKhoa());
        dto.setTenKhoa(khoa.getTenKhoa());
        return dto;
    }

    public List<Khoa_DTO_Resp> toResponseDTOs(List<Khoa> entities) {
        if (entities == null) return Collections.emptyList();
        return entities.stream()
                .map(Khoa_Mapp::toDTOResp)
                .collect(Collectors.toList());
    }
}