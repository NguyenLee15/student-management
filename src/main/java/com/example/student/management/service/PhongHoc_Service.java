package com.example.student.management.service;

import java.util.Optional;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.example.student.management.dto.req.PhongHoc_DTO_Req;
import com.example.student.management.dto.resp.PhongHoc_DTO_Resp;
import com.example.student.management.enums.ToaNha;

public interface  PhongHoc_Service {
    
    // Lấy danh sách toàn bộ phòng học (phân trang)
    Page<PhongHoc_DTO_Resp> getAll(Pageable pageable);
    
    List<PhongHoc_DTO_Resp> getAll();

    // Tìm kiếm theo tòa nhà (ignore case, phân trang)
    Page<PhongHoc_DTO_Resp> searchByToaNha(ToaNha toaNha, Pageable pageable);

    // Thêm mới phòng học
    PhongHoc_DTO_Resp create(PhongHoc_DTO_Req dto);

    // Cập nhật phòng học
    PhongHoc_DTO_Resp update(String maPhong, PhongHoc_DTO_Req dto);

    // Xoá phòng học theo mã
    void delete(String maPhong);
    
 // Lấy chi tiết một phòng học theo mã
    Optional<PhongHoc_DTO_Resp> getById(String maPhong);

    // Kiểm tra mã phòng học đã tồn tại hay chưa
    boolean existsById(String maPhong);
}
