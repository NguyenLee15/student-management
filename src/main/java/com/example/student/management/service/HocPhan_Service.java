package com.example.student.management.service;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import com.example.student.management.dto.req.HocPhan_DTO_Req;
import com.example.student.management.dto.resp.HocPhan_DTO_Resp;
import com.example.student.management.enums.LoaiHocPhan;

public interface HocPhan_Service {
    Page<HocPhan_DTO_Resp> getAll(int page, int size);
    Optional<HocPhan_DTO_Resp> getById(String maHocPhan);
    HocPhan_DTO_Resp create(HocPhan_DTO_Req hocPhanDTO);
    HocPhan_DTO_Resp update(String maHocPhan, HocPhan_DTO_Req hocPhanDTO);
    void delete(String maHocPhan);
    Page<HocPhan_DTO_Resp> searchByLoaiHocPhan(LoaiHocPhan loaiHocPhan, int page, int size);
    Page<HocPhan_DTO_Resp> searchByMaKhoa(String maKhoa, int page, int size);
    ByteArrayInputStream exportToExcel(Page<HocPhan_DTO_Resp> hocPhanPage);
    void importFromExcel(MultipartFile file);
    List<HocPhan_DTO_Resp> getAll();
}