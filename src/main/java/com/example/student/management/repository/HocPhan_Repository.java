package com.example.student.management.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.student.management.entity.HocPhan;
import com.example.student.management.enums.LoaiHocPhan;

public interface HocPhan_Repository extends JpaRepository<HocPhan, String> {
    Page<HocPhan> findByLoaiHocPhan(LoaiHocPhan loaiHocPhan, Pageable pageable);
    Page<HocPhan> findByKhoa_MaKhoa(String maKhoa, Pageable pageable);
}