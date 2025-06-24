package com.example.student.management.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.student.management.entity.Lop;

public interface  Lop_Repository extends JpaRepository <Lop, String>{
    // Tìm kiếm theo mã khoa 
    // List<Lop> findByKhoa_MaKhoa(String maKhoa);

    // Tìm kiếm theo tên lớp 
    // List<Lop> findByTenLopContainingIgnoreCase(String keyword);

     // Tìm kiếm theo mã khoa, phân trang
    Page<Lop> findByKhoa_MaKhoa(String maKhoa, Pageable pageable);

}
