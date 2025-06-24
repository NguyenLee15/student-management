package com.example.student.management.service.impl;

import com.example.student.management.dto.req.GiangVien_DTO_Req;
import com.example.student.management.dto.resp.GiangVien_DTO_Resp;
import com.example.student.management.entity.GiangVien;
import com.example.student.management.entity.Khoa;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.GiangVien_Mapp;
import com.example.student.management.repository.GiangVien_Repository;
import com.example.student.management.repository.Khoa_Repository;
import com.example.student.management.service.GiangVien_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GiangVien_Impl implements GiangVien_Service {

    @Autowired
    private GiangVien_Repository giangVienRepository;

    @Autowired
    private Khoa_Repository khoaRepository;

    @Override
    public Page<GiangVien_DTO_Resp> getAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return giangVienRepository.findAll(pageable)
                .map(GiangVien_Mapp::toDTOResp);
    }
    
    @Override
    public List<GiangVien_DTO_Resp> getAll() {
		return giangVienRepository.findAll().stream()
				.map(GiangVien_Mapp::toDTOResp)
				.collect(Collectors.toList());
	}

    @Override
    public Optional<GiangVien_DTO_Resp> getById(String maGiangVien) {
        return giangVienRepository.findById(maGiangVien)
                .map(GiangVien_Mapp::toDTOResp);
    }

    @Override
    public GiangVien_DTO_Resp create(GiangVien_DTO_Req giangVienDTO) {
        if (giangVienRepository.existsById(giangVienDTO.getMaGiangVien())) {
            throw new IllegalArgumentException("Mã giảng viên đã tồn tại.");
        }
        Khoa khoa = khoaRepository.findById(giangVienDTO.getMaKhoa())
                .orElseThrow(() -> new NotFoundException("Khoa không tồn tại."));
        GiangVien giangVien = GiangVien_Mapp.toEntity(giangVienDTO, khoa);
        giangVienRepository.save(giangVien);
        return GiangVien_Mapp.toDTOResp(giangVien);
    }

    @Override
    public GiangVien_DTO_Resp update(String maGiangVien, GiangVien_DTO_Req giangVienDTO) {
        GiangVien giangVien = giangVienRepository.findById(maGiangVien)
                .orElseThrow(() -> new NotFoundException("Giảng viên không tồn tại."));
        Khoa khoa = khoaRepository.findById(giangVienDTO.getMaKhoa())
                .orElseThrow(() -> new NotFoundException("Khoa không tồn tại."));
        giangVien.setTenGiangVien(giangVienDTO.getTenGiangVien());
        giangVien.setEmail(giangVienDTO.getEmail());
        giangVien.setKhoa(khoa);
        giangVienRepository.save(giangVien);
        return GiangVien_Mapp.toDTOResp(giangVien);
    }

    @Override
    public void delete(String maGiangVien) {
        if (!giangVienRepository.existsById(maGiangVien)) {
            throw new NotFoundException("Giảng viên không tồn tại.");
        }
        giangVienRepository.deleteById(maGiangVien);
    }

    @Override
    public Page<GiangVien_DTO_Resp> searchByTenGiangVien(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return giangVienRepository.findByTenGiangVienContainingIgnoreCase(keyword, pageable)
                .map(GiangVien_Mapp::toDTOResp);
    }

    @Override
    public Page<GiangVien_DTO_Resp> searchByMaKhoa(String maKhoa, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return giangVienRepository.findByKhoa_MaKhoa(maKhoa, pageable)
                .map(GiangVien_Mapp::toDTOResp);
    }

    @Override
    public Page<GiangVien_DTO_Resp> searchByTenKhoa(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return giangVienRepository.findByKhoa_TenKhoaContainingIgnoreCase(keyword, pageable)
                .map(GiangVien_Mapp::toDTOResp);
    }
}