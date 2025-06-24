package com.example.student.management.repository;

import com.example.student.management.entity.LopTinChi;
import com.example.student.management.entity.LopTinChiSinhVien;
import com.example.student.management.entity.SinhVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LopTinChiSinhVien_Repository extends JpaRepository<LopTinChiSinhVien, Integer> {

    boolean existsByLopTinChiAndSinhVien(LopTinChi lopTinChi, SinhVien sinhVien);

    Optional<LopTinChiSinhVien> findByLopTinChiAndSinhVien(LopTinChi lopTinChi, SinhVien sinhVien);

    @Query("DELETE FROM LopTinChiSinhVien ltcsv WHERE ltcsv.lopTinChi.lopTinChiId = :lopTinChiId AND ltcsv.sinhVien.maSinhVien = :maSinhVien")
    void deleteByLopTinChiIdAndMaSinhVien(@Param("lopTinChiId") Long lopTinChiId, @Param("maSinhVien") String maSinhVien);
}