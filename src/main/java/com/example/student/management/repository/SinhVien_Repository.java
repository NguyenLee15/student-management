package com.example.student.management.repository;

import com.example.student.management.entity.SinhVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SinhVien_Repository extends JpaRepository<SinhVien, String> {

    @Query("SELECT sv FROM SinhVien sv " +
           "WHERE (:keyword IS NULL OR LOWER(sv.maSinhVien) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(sv.hoVaTen) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:maLop IS NULL OR sv.lop.maLop = :maLop) " +
           "AND (:maKhoa IS NULL OR sv.lop.khoa.maKhoa = :maKhoa) " +
           "AND (:maKhoaHoc IS NULL OR sv.khoaHoc.maKhoaHoc = :maKhoaHoc)")
    Page<SinhVien> findByMaSVOrHoVaTenAndFilters(
            @Param("keyword") String keyword,
            @Param("maLop") String maLop,
            @Param("maKhoa") String maKhoa,
            @Param("maKhoaHoc") String maKhoaHoc,
            Pageable pageable);

    @Query("SELECT sv FROM SinhVien sv WHERE sv.lop.maLop = :maLop")
    List<SinhVien> findByMaLop(String maLop);

    @Query("SELECT sv FROM SinhVien sv JOIN LopTinChiSinhVien ltcsv ON sv.maSinhVien = ltcsv.sinhVien.maSinhVien WHERE ltcsv.lopTinChi.lopTinChiId = :id")
    List<SinhVien> findByLopTinChiId(int id);
}