package com.example.student.management.service;

import java.util.Optional;

import org.springframework.data.domain.Page;

import com.example.student.management.dto.req.LichHocKy_DTO_Req;
import com.example.student.management.dto.resp.LichHocKy_DTO_Resp;

public interface LichHocKy_Service {
    Page<LichHocKy_DTO_Resp> getAll(int page, int size);

    Page<LichHocKy_DTO_Resp> searchByMaHocPhan(String maHocPhan, int page, int size);

    Page<LichHocKy_DTO_Resp> searchByHocKy(String hocKy, int page, int size);

    Page<LichHocKy_DTO_Resp> searchByNamHoc(String namHoc, int page, int size);

    Optional<LichHocKy_DTO_Resp> getById(int id);

    LichHocKy_DTO_Resp create(LichHocKy_DTO_Req dto);

    LichHocKy_DTO_Resp update(int id, LichHocKy_DTO_Req dto);

    void delete(int id);
}
