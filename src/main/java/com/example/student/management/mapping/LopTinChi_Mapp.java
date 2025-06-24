package com.example.student.management.mapping;

import com.example.student.management.dto.req.LopTinChi_DTO_Req;
import com.example.student.management.dto.resp.LopTinChi_DTO_Resp;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.LopTinChi;

import java.util.List;
import java.util.stream.Collectors;

public class LopTinChi_Mapp {
    public static LopTinChi toEntity(LopTinChi_DTO_Req dto, HocPhan hocPhan) {
        if (dto == null) return null;
        LopTinChi lopTinChi = new LopTinChi();
        lopTinChi.setLopTinChiId(dto.getLopTinChiId());
        lopTinChi.setTenLopTinChi(dto.getTenLopTinChi());
        lopTinChi.setHocPhan(hocPhan);
        return lopTinChi;
    }

    public static LopTinChi_DTO_Resp toDTOResp(LopTinChi lopTinChi) {
        if (lopTinChi == null) return null;
        return new LopTinChi_DTO_Resp(
                lopTinChi.getLopTinChiId(),
                lopTinChi.getTenLopTinChi()
        );
    }

    public static LopTinChi_DTO_Req toDTOReq(LopTinChi lopTinChi) {
        if (lopTinChi == null) return null;
        LopTinChi_DTO_Req req = new LopTinChi_DTO_Req();
        req.setLopTinChiId(lopTinChi.getLopTinChiId());
        req.setTenLopTinChi(lopTinChi.getTenLopTinChi());
        req.setMaHocPhan(lopTinChi.getHocPhan() != null ? lopTinChi.getHocPhan().getMaHocPhan() : null);
        return req;
    }

    public static List<LopTinChi_DTO_Resp> toDTORespList(List<LopTinChi> lopTinChis) {
        return lopTinChis.stream()
                .map(LopTinChi_Mapp::toDTOResp)
                .collect(Collectors.toList());
    }
}