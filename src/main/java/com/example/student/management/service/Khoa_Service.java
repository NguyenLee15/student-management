package com.example.student.management.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;

import com.example.student.management.dto.req.Khoa_DTO_Req;
import com.example.student.management.dto.resp.Khoa_DTO_Resp;

public interface Khoa_Service {
    
    // Lấy tất cả danh sách khoa (phân trang)
    Page<Khoa_DTO_Resp> getAll(org.springframework.data.domain.Pageable pageable);

    // Thêm mới khoa
    Khoa_DTO_Resp create(Khoa_DTO_Req khoaDTO);

    // Cập nhật khoa
    Khoa_DTO_Resp update(String maKhoa, Khoa_DTO_Req khoaDTO);

    // Xóa khoa
    void delete(String maKhoa);

	Optional<Khoa_DTO_Resp> getById(String maKhoa);
	
	List<Khoa_DTO_Resp> getAll();
}
