package com.example.student.management.repository;

import com.example.student.management.entity.DiemHocTap;
import com.example.student.management.enums.Dot;
import com.example.student.management.enums.HocKi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DiemHocTap_Repository extends JpaRepository<DiemHocTap, Integer> {

    Page<DiemHocTap> findBySinhVien_MaSinhVien(@Param("maSinhVien") String maSinhVien, Pageable pageable);

    @Query("SELECT dht FROM DiemHocTap dht WHERE dht.hocPhan.maHocPhan = :maHocPhan")
    Page<DiemHocTap> findByMaHocPhan(@Param("maHocPhan") String maHocPhan, Pageable pageable);

    Page<DiemHocTap> findByHocKy(@Param("hocKy") HocKi hocKy, Pageable pageable);

    Page<DiemHocTap> findByDot(@Param("dot") Dot dot, Pageable pageable);

    Page<DiemHocTap> findByDiemChu(@Param("diemChu") String diemChu, Pageable pageable);

    @Query("SELECT dht FROM DiemHocTap dht JOIN dht.sinhVien sv WHERE sv.lop.maLop = :maLop")
    Page<DiemHocTap> findByMaLop(@Param("maLop") String maLop, Pageable pageable);

    @Query("SELECT dht FROM DiemHocTap dht JOIN dht.sinhVien sv WHERE sv.khoaHoc.maKhoaHoc = :maKhoaHoc")
    Page<DiemHocTap> findByMaKhoaHoc(@Param("maKhoaHoc") String maKhoaHoc, Pageable pageable);

    @Query("SELECT dht FROM DiemHocTap dht JOIN dht.sinhVien sv JOIN sv.lop l WHERE l.khoa.maKhoa = :maKhoa")
    Page<DiemHocTap> findByMaKhoa(@Param("maKhoa") String maKhoa, Pageable pageable);

    @Query("DELETE FROM DiemHocTap dht WHERE dht.sinhVien.maSinhVien = :maSinhVien")
    void deleteByMaSV(@Param("maSinhVien") String maSinhVien);

    @Query("SELECT CASE WHEN COUNT(dht) > 0 THEN true ELSE false END FROM DiemHocTap dht " +
           "WHERE dht.sinhVien.maSinhVien = :maSinhVien " +
           "AND dht.hocPhan.maHocPhan = :maHocPhan " +
           "AND dht.hocKy = :hocKy " +
           "AND dht.namHoc = :namHoc " +
           "AND dht.dot = :dot " +
           "AND (:id IS NULL OR dht.diemHocTapId != :id)")
    boolean existsByUniqueConstraint(@Param("maSinhVien") String maSinhVien,
                                    @Param("maHocPhan") String maHocPhan,
                                    @Param("hocKy") HocKi hocKy,
                                    @Param("namHoc") String namHoc,
                                    @Param("dot") Dot dot,
                                    @Param("id") Integer id);
}