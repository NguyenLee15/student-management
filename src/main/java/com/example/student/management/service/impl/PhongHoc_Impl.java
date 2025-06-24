package com.example.student.management.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.student.management.dto.req.PhongHoc_DTO_Req;
import com.example.student.management.dto.resp.PhongHoc_DTO_Resp;
import com.example.student.management.entity.PhongHoc;
import com.example.student.management.enums.ToaNha;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.PhongHoc_Mapp;
import com.example.student.management.repository.PhongHoc_Repository;
import com.example.student.management.service.PhongHoc_Service;

@Service
public class PhongHoc_Impl implements PhongHoc_Service {

    @Autowired
    private PhongHoc_Repository phongHocRepository;

    @Override
    public Page<PhongHoc_DTO_Resp> getAll(Pageable pageable) {
        return phongHocRepository.findAll(pageable).map(PhongHoc_Mapp::toDTOResp);
    }
    
    @Override
    public List<PhongHoc_DTO_Resp> getAll() {
		return phongHocRepository.findAll().stream()
				.map(PhongHoc_Mapp::toDTOResp)
				.toList();
	}

    @Override
    public Page<PhongHoc_DTO_Resp> searchByToaNha(ToaNha toaNha, Pageable pageable) {
        return phongHocRepository.findByToaNha(toaNha, pageable)
                .map(PhongHoc_Mapp::toDTOResp);
    }

    @Override
    public PhongHoc_DTO_Resp create(PhongHoc_DTO_Req dto) {
        if (phongHocRepository.existsByMaPhong(dto.getMaPhong())) {
            throw new IllegalArgumentException("Mã phòng đã tồn tại: " + dto.getMaPhong());
        }
        PhongHoc phongHoc = PhongHoc_Mapp.toEntity(dto);
        PhongHoc savedPhongHoc = phongHocRepository.save(phongHoc);
        return PhongHoc_Mapp.toDTOResp(savedPhongHoc);
    }

    @Override
    public PhongHoc_DTO_Resp update(String maPhong, PhongHoc_DTO_Req dto) {
        PhongHoc phongHoc = phongHocRepository.findById(maPhong)
                .orElseThrow(() -> new NotFoundException("Phòng học không tồn tại: " + maPhong));
        phongHoc.setTenPhong(dto.getTenPhong());
        phongHoc.setSucChua(dto.getSucChua());
        phongHoc.setToaNha(dto.getToaNha());
        PhongHoc updatedPhongHoc = phongHocRepository.save(phongHoc);
        return PhongHoc_Mapp.toDTOResp(updatedPhongHoc);
    }

    @Override
    public void delete(String maPhong) {
        if (!phongHocRepository.existsById(maPhong)) {
            throw new NotFoundException("Phòng học không tồn tại: " + maPhong);
        }
        phongHocRepository.deleteById(maPhong);
    }

    @Override
    public Optional<PhongHoc_DTO_Resp> getById(String maPhong) {
        return phongHocRepository.findById(maPhong).map(PhongHoc_Mapp::toDTOResp);
    }

    @Override
    public boolean existsById(String maPhong) {
        return phongHocRepository.existsByMaPhong(maPhong);
    }
}