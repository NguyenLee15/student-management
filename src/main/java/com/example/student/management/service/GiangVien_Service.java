package com.example.student.management.service;


import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

import com.example.student.management.dto.req.GiangVien_DTO_Req;
import com.example.student.management.dto.resp.GiangVien_DTO_Resp;

public interface GiangVien_Service {
    Page<GiangVien_DTO_Resp> getAll(int page, int size);
    
    List<GiangVien_DTO_Resp> getAll();

    Optional<GiangVien_DTO_Resp> getById(String maGiangVien);

    GiangVien_DTO_Resp create(GiangVien_DTO_Req giangVienDTO);

    GiangVien_DTO_Resp update(String maGiangVien, GiangVien_DTO_Req giangVienDTO);

    void delete(String maGiangVien);

    Page<GiangVien_DTO_Resp> searchByTenGiangVien(String keyword, int page, int size);

    Page<GiangVien_DTO_Resp> searchByMaKhoa(String maKhoa, int page, int size);

    Page<GiangVien_DTO_Resp> searchByTenKhoa(String keyword, int page, int size);
}
