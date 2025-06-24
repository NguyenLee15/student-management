package com.example.student.management.service;

import com.example.student.management.dto.req.DiemHocTap_DTO_Req;
import com.example.student.management.dto.resp.DiemHocTap_DTO_Resp;
import com.example.student.management.enums.Dot;
import com.example.student.management.enums.HocKi;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface DiemHocTap_Service {

    Page<DiemHocTap_DTO_Resp> findAll(Pageable pageable);

    DiemHocTap_DTO_Resp findById(Integer id);

    DiemHocTap_DTO_Resp create(DiemHocTap_DTO_Req requestDTO);

    DiemHocTap_DTO_Resp update(Integer id, DiemHocTap_DTO_Req requestDTO);

    void delete(Integer id);

    Page<DiemHocTap_DTO_Resp> findByMaSV(String maSV, Pageable pageable);

    Page<DiemHocTap_DTO_Resp> findByMaHocPhan(String maHocPhan, Pageable pageable);

    Page<DiemHocTap_DTO_Resp> findByHocKy(HocKi hocKy, Pageable pageable);

    Page<DiemHocTap_DTO_Resp> findByDot(Dot dot, Pageable pageable);

    Page<DiemHocTap_DTO_Resp> findByDiemChu(String diemChu, Pageable pageable);

    Page<DiemHocTap_DTO_Resp> findByMaLop(String maLop, Pageable pageable);

    Page<DiemHocTap_DTO_Resp> findByMaKhoaHoc(String maKhoaHoc, Pageable pageable);

    Page<DiemHocTap_DTO_Resp> findByMaKhoa(String maKhoa, Pageable pageable);

    ByteArrayInputStream exportToExcel(List<DiemHocTap_DTO_Resp> diemHocTaps);

    List<DiemHocTap_DTO_Resp> importFromExcel(MultipartFile file);
}