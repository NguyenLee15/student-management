package com.example.student.management.service;

import com.example.student.management.dto.req.SinhVien_DTO_Req;
import com.example.student.management.dto.resp.SinhVien_DTO_Resp;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface SinhVien_Service {
    Page<SinhVien_DTO_Resp> getAll(Pageable pageable);
    Page<SinhVien_DTO_Resp> searchAndFilter(String keyword, String maLop, String maKhoa, String maKhoaHoc, Pageable pageable);
    SinhVien_DTO_Resp create(SinhVien_DTO_Req dto);
    SinhVien_DTO_Resp update(String maSV, SinhVien_DTO_Req dto);
    void delete(String maSV);
    SinhVien_DTO_Resp getById(String maSV);
    List<SinhVien_DTO_Resp> importFromExcel(MultipartFile file);
    ByteArrayInputStream exportToExcel(List<SinhVien_DTO_Resp> sinhViens);
    List<SinhVien_DTO_Resp> getAllForExport();
    List<SinhVien_DTO_Resp> getSinhVienByMaLop(String maLop);
    List<SinhVien_DTO_Resp> getSinhVienByLopTinChiId(int id);
}