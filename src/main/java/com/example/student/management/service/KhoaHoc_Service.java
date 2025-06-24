package com.example.student.management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

import com.example.student.management.dto.req.KhoaHoc_DTO_Req;
import com.example.student.management.dto.resp.KhoaHoc_DTO_Resp;

public interface  KhoaHoc_Service {
    
    // Lấy danh sách tất cả khóa học có phân trang
    Page<KhoaHoc_DTO_Resp> getAll(int page, int size);

    // Lấy khóa học theo mã
    Optional<KhoaHoc_DTO_Resp> getById(String maKhoaHoc);

    // Thêm mới khóa học
    KhoaHoc_DTO_Resp create(KhoaHoc_DTO_Req dto);

    // Cập nhật khóa học
    KhoaHoc_DTO_Resp update(String maKhoaHoc, KhoaHoc_DTO_Req dto);

    // Xóa khóa học
    void delete(String maKhoaHoc);
    
    boolean exists(String maKhoaHoc);
    
    List<KhoaHoc_DTO_Resp> getAll();
}
