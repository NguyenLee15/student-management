package com.example.student.management.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.example.student.management.dto.req.KhoaHoc_DTO_Req;
import com.example.student.management.dto.resp.KhoaHoc_DTO_Resp;
import com.example.student.management.entity.KhoaHoc;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.KhoaHoc_Mapp;
import com.example.student.management.repository.KhoaHoc_Repository;
import com.example.student.management.service.KhoaHoc_Service;

@Service
public class KhoaHoc_Impl implements KhoaHoc_Service {

    @Autowired
    private KhoaHoc_Repository khoaHocRepository;

    @Override
    public Page<KhoaHoc_DTO_Resp> getAll(int page, int size) {
        Page<KhoaHoc> khoaHocPage = khoaHocRepository.findAll(PageRequest.of(page, size));
        return khoaHocPage.map(KhoaHoc_Mapp::toDTOResp);
    }
    
    @Override
    public List<KhoaHoc_DTO_Resp> getAll() {
		return khoaHocRepository.findAll().stream()
				.map(KhoaHoc_Mapp::toDTOResp)
				.toList();
	}

    @Override
    public Optional<KhoaHoc_DTO_Resp> getById(String maKhoaHoc) {
        return khoaHocRepository.findById(maKhoaHoc)
                .map(KhoaHoc_Mapp::toDTOResp);
    }

    @Override
    public KhoaHoc_DTO_Resp create(KhoaHoc_DTO_Req dto) {
        KhoaHoc khoaHoc = KhoaHoc_Mapp.toEntity(dto);
        KhoaHoc savedKhoaHoc = khoaHocRepository.save(khoaHoc);
        return KhoaHoc_Mapp.toDTOResp(savedKhoaHoc);
    }

    @Override
    public KhoaHoc_DTO_Resp update(String maKhoaHoc, KhoaHoc_DTO_Req dto) {
        KhoaHoc khoaHoc = khoaHocRepository.findById(maKhoaHoc)
                .orElseThrow(() -> new NotFoundException("Khóa học không tồn tại: " + maKhoaHoc));
        khoaHoc.setNamBatDau(dto.getNamBatDau());
        khoaHoc.setNamKetThuc(dto.getNamKetThuc());
        KhoaHoc updatedKhoaHoc = khoaHocRepository.save(khoaHoc);
        return KhoaHoc_Mapp.toDTOResp(updatedKhoaHoc);
    }

    @Override
    public void delete(String maKhoaHoc) {
        if (!khoaHocRepository.existsById(maKhoaHoc)) {
            throw new NotFoundException("Khóa học không tồn tại: " + maKhoaHoc);
        }
        khoaHocRepository.deleteById(maKhoaHoc);
    }
    
    @Override
    public boolean exists(String maKhoaHoc) {
        return khoaHocRepository.existsById(maKhoaHoc);
    }
}