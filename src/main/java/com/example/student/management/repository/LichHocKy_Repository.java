package com.example.student.management.repository;

import com.example.student.management.entity.LichHocKy;
import com.example.student.management.enums.HocKi;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LichHocKy_Repository extends JpaRepository<LichHocKy, Integer> {

    @Query("SELECT lhk FROM LichHocKy lhk WHERE lhk.hocPhan.maHocPhan = :maHocPhan")
    Page<LichHocKy> findByMaHocPhan(@Param("maHocPhan") String maHocPhan, Pageable pageable);

    Page<LichHocKy> findByHocKy(String hocKy, Pageable pageable);

    Page<LichHocKy> findByNamHoc(String namHoc, Pageable pageable);

    @Query("SELECT CASE WHEN COUNT(lhk) > 0 THEN true ELSE false END FROM LichHocKy lhk " +
           "WHERE lhk.lopTinChi.lopTinChiId = :lopTinchiId " +
           "AND lhk.hocPhan.maHocPhan = :maHocPhan " +
           "AND lhk.hocKy = :hocKy " +
           "AND lhk.namHoc = :namHoc")
    boolean existsByMaLopTinChiAndMaHocPhanAndHocKyAndNamHoc(
            @Param("lopTinchiId") long lopTinchiId,
            @Param("maHocPhan") String maHocPhan,
            @Param("hocKy") HocKi hocKiEnum,
            @Param("namHoc") String namHoc);

    @Query("SELECT CASE WHEN COUNT(lhk) > 0 THEN true ELSE false END FROM LichHocKy lhk " +
           "WHERE lhk.lopTinChi.lopTinChiId = :lopTinchiId " +
           "AND lhk.hocPhan.maHocPhan = :maHocPhan " +
           "AND lhk.hocKy = :hocKy " +
           "AND lhk.namHoc = :namHoc " +
           "AND lhk.lichHocKyId != :id")
    boolean existsByMaLopTinChiAndMaHocPhanAndHocKyAndNamHocAndIdNot(
            @Param("lopTinchiId") long maLopTinChi,
            @Param("maHocPhan") String maHocPhan,
            @Param("hocKy") HocKi hocKiEnum,
            @Param("namHoc") String namHoc,
            @Param("id") int id);
}