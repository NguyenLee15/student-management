package com.example.student.management.service.impl;

import com.example.student.management.dto.req.LichHocKy_DTO_Req;
import com.example.student.management.dto.resp.LichHocKy_DTO_Resp;
import com.example.student.management.entity.GiangVien;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.LichHocKy;
import com.example.student.management.entity.LopTinChi;
import com.example.student.management.entity.PhongHoc;
import com.example.student.management.enums.HocKi;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.LichHocKy_Mapp;
import com.example.student.management.repository.GiangVien_Repository;
import com.example.student.management.repository.HocPhan_Repository;
import com.example.student.management.repository.LichHocKy_Repository;
import com.example.student.management.repository.LopTinChi_Repository;
import com.example.student.management.repository.PhongHoc_Repository;
import com.example.student.management.service.LichHocKy_Service;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LichHocKy_Impl implements LichHocKy_Service {

    private static final Logger logger = LoggerFactory.getLogger(LichHocKy_Impl.class);

    private final LichHocKy_Repository lichHocKyRepository;
    private final LopTinChi_Repository lopTinChiRepository;
    private final HocPhan_Repository hocPhanRepository;
    private final GiangVien_Repository giangVienRepository;
    private final PhongHoc_Repository phongHocRepository;

    @Override
    public Page<LichHocKy_DTO_Resp> getAll(int page, int size) {
        logger.debug("Fetching all schedules, page={}, size={}", page, size);
        return lichHocKyRepository.findAll(PageRequest.of(page, size))
                .map(LichHocKy_Mapp::toDTOResp);
    }

    @Override
    public Page<LichHocKy_DTO_Resp> searchByMaHocPhan(String maHocPhan, int page, int size) {
        logger.debug("Searching schedules by maHocPhan={}, page={}, size={}", maHocPhan, page, size);
        return lichHocKyRepository.findByMaHocPhan(maHocPhan, PageRequest.of(page, size))
                .map(LichHocKy_Mapp::toDTOResp);
    }

    @Override
    public Page<LichHocKy_DTO_Resp> searchByHocKy(String hocKy, int page, int size) {
        logger.debug("Searching schedules by hocKy={}, page={}, size={}", hocKy, page, size);
        return lichHocKyRepository.findByHocKy(hocKy, PageRequest.of(page, size))
                .map(LichHocKy_Mapp::toDTOResp);
    }

    @Override
    public Page<LichHocKy_DTO_Resp> searchByNamHoc(String namHoc, int page, int size) {
        logger.debug("Searching schedules by namHoc={}, page={}, size={}", namHoc, page, size);
        return lichHocKyRepository.findByNamHoc(namHoc, PageRequest.of(page, size))
                .map(LichHocKy_Mapp::toDTOResp);
    }

    @Override
    public Optional<LichHocKy_DTO_Resp> getById(int id) {
        logger.debug("Fetching schedule by id={}", id);
        return lichHocKyRepository.findById(id)
                .map(LichHocKy_Mapp::toDTOResp);
    }

    @Override
    public LichHocKy_DTO_Resp create(LichHocKy_DTO_Req dto) {
    	
    	HocKi hocKiEnum = HocKi.valueOf(dto.getHocKy().getValue().toUpperCase());
        logger.debug("Creating schedule: maLopTinChi={}, maHocPhan={}, hocKy={}, namHoc={}",
                dto.getLopTinChiId(), dto.getMaHocPhan(), dto.getHocKy(), dto.getNamHoc());

        // Validate related entities
        LopTinChi lopTinChi = lopTinChiRepository.findByLopTinChiId(dto.getLopTinChiId())
                .orElseThrow(() -> new NotFoundException("Lớp tín chỉ không tồn tại."));
        HocPhan hocPhan = hocPhanRepository.findById(dto.getMaHocPhan())
                .orElseThrow(() -> new NotFoundException("Học phần không tồn tại."));
        GiangVien giangVien = giangVienRepository.findById(dto.getMaGiangVien())
                .orElseThrow(() -> new NotFoundException("Giảng viên không tồn tại."));
        PhongHoc phongHoc = phongHocRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new NotFoundException("Phòng học không tồn tại."));

        // Check for duplicate schedule
        if (lichHocKyRepository.existsByMaLopTinChiAndMaHocPhanAndHocKyAndNamHoc(
                dto.getLopTinChiId(), dto.getMaHocPhan(), hocKiEnum, dto.getNamHoc())) {
            logger.warn("Duplicate schedule: maLopTinChi={}, maHocPhan={}, hocKy={}, namHoc={}",
                    dto.getLopTinChiId(), dto.getMaHocPhan(), dto.getHocKy(), dto.getNamHoc());
            throw new IllegalArgumentException("Lịch học kỳ đã tồn tại.");
        }

        LichHocKy lichHocKy = LichHocKy_Mapp.toEntity(dto, lopTinChi, hocPhan, giangVien, phongHoc);
        lichHocKyRepository.save(lichHocKy);
        logger.debug("Created schedule: id={}", lichHocKy.getLichHocKyId());
        return LichHocKy_Mapp.toDTOResp(lichHocKy);
    }

    @Override
    public LichHocKy_DTO_Resp update(int id, LichHocKy_DTO_Req dto) {
    	HocKi hocKiEnum = HocKi.valueOf(dto.getHocKy().getValue().toUpperCase());
        logger.debug("Updating schedule: id={}, maLopTinChi={}, maHocPhan={}, hocKy={}, namHoc={}",
                id, dto.getLopTinChiId(), dto.getMaHocPhan(), dto.getHocKy(), dto.getNamHoc());

        // Check if schedule exists
        LichHocKy lichHocKy = lichHocKyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lịch học kỳ không tồn tại."));

        // Validate related entities
        LopTinChi lopTinChi = lopTinChiRepository.findByLopTinChiId(dto.getLopTinChiId())
                .orElseThrow(() -> new NotFoundException("Lớp tín chỉ không tồn tại."));
        HocPhan hocPhan = hocPhanRepository.findById(dto.getMaHocPhan())
                .orElseThrow(() -> new NotFoundException("Học phần không tồn tại."));
        GiangVien giangVien = giangVienRepository.findById(dto.getMaGiangVien())
                .orElseThrow(() -> new NotFoundException("Giảng viên không tồn tại."));
        PhongHoc phongHoc = phongHocRepository.findById(dto.getMaPhong())
                .orElseThrow(() -> new NotFoundException("Phòng học không tồn tại."));

        // Check for duplicate schedule (excluding current ID)
        if (lichHocKyRepository.existsByMaLopTinChiAndMaHocPhanAndHocKyAndNamHocAndIdNot(
                dto.getLopTinChiId(), dto.getMaHocPhan(), hocKiEnum, dto.getNamHoc(), id)) {
            logger.warn("Duplicate schedule: id={}, maLopTinChi={}, maHocPhan={}, hocKy={}, namHoc={}",
                    id, dto.getLopTinChiId(), dto.getMaHocPhan(), dto.getHocKy(), dto.getNamHoc());
            throw new IllegalArgumentException("Lịch học kỳ đã tồn tại.");
        }

        // Update fields
        lichHocKy.setLopTinChi(lopTinChi);
        lichHocKy.setHocPhan(hocPhan);
        lichHocKy.setGiangVien(giangVien);
        lichHocKy.setPhongHoc(phongHoc);
        lichHocKy.setHocKy(dto.getHocKy());
        lichHocKy.setNamHoc(dto.getNamHoc());
        lichHocKy.setThoiGianHoc(dto.getThoiGianHoc());
        lichHocKy.setCaHoc(dto.getCaHoc());
        lichHocKy.setNgayBatDauHoc(dto.getNgayBatDauHoc());
        lichHocKy.setNgayKetThucHoc(dto.getNgayKetThucHoc());

        lichHocKyRepository.save(lichHocKy);
        logger.debug("Updated schedule: id={}", id);
        return LichHocKy_Mapp.toDTOResp(lichHocKy);
    }

    @Override
    public void delete(int id) {
        logger.debug("Deleting schedule: id={}", id);
        if (!lichHocKyRepository.existsById(id)) {
            throw new NotFoundException("Lịch học kỳ không tồn tại.");
        }
        lichHocKyRepository.deleteById(id);
        logger.debug("Deleted schedule: id={}", id);
    }
}