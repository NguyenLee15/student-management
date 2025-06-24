package com.example.student.management.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.student.management.entity.GiangVien;

public interface  GiangVien_Repository extends JpaRepository <GiangVien, String> {
   
    // Tìm kiếm giảng viên theo mã khoa 
    // List<GiangVien> findByKhoa_MaKhoa(String maKhoa);

    // Tìm kiếm theo tên giảng viên không phân biệt chữ hoa , chữ thường 
    // List<GiangVien> findByTenGiangVienContainingIgnoreCase(String keyword);

    // Tìm kiếm giảng viên theo tên khoa 
    // @Query("SELECT gv FROM GiangVien gv JOIN gv.khoa k WHERE k.tenKhoa LIKE %:tenKhoa%")
    // List<GiangVien> findByKhoa_TenKhoaContainingIgnoreCase(@Param("tenKhoa") String tenKhoa);

    Page<GiangVien> findByKhoa_MaKhoa(String maKhoa, Pageable pageable);
    Page<GiangVien> findByTenGiangVienContainingIgnoreCase(String keyword, Pageable pageable);
    Page<GiangVien> findByKhoa_TenKhoaContainingIgnoreCase(String tenKhoa, Pageable pageable);
}
