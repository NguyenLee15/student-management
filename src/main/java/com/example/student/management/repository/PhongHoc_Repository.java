package com.example.student.management.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.student.management.entity.PhongHoc;
import com.example.student.management.enums.ToaNha;

public interface PhongHoc_Repository extends JpaRepository<PhongHoc, String>{

    boolean existsByMaPhong(String maPhong);

    // Tìm kiếm theo tòa nhà, phân trang
    Page<PhongHoc> findByToaNha(ToaNha toaNha, Pageable pageable);

}
