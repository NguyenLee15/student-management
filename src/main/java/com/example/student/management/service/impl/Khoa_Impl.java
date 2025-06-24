package com.example.student.management.service.impl;

import com.example.student.management.dto.req.Khoa_DTO_Req;
import com.example.student.management.dto.resp.Khoa_DTO_Resp;
import com.example.student.management.entity.Khoa;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.Khoa_Mapp;
import com.example.student.management.repository.Khoa_Repository;
import com.example.student.management.service.Khoa_Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class Khoa_Impl implements Khoa_Service {

    @Autowired
    private Khoa_Repository khoaRepository;

    @Override
    public Page<Khoa_DTO_Resp> getAll(Pageable pageable) {
        return khoaRepository.findAll(pageable).map(Khoa_Mapp::toDTOResp);
    }
    
    @Override
    public List<Khoa_DTO_Resp> getAll(){
		return khoaRepository.findAll().stream()
				.map(Khoa_Mapp::toDTOResp)
				.toList();
	}
    
    @Override
    public Optional<Khoa_DTO_Resp> getById(String maKhoa) {
        Optional<Khoa> khoa = khoaRepository.findById(maKhoa);
        return khoa.map(Khoa_Mapp::toDTOResp);
    }

    @Override
    public Khoa_DTO_Resp create(Khoa_DTO_Req khoaDTO) {
        // Kiểm tra mã khoa đã tồn tại
        if (khoaRepository.existsById(khoaDTO.getMaKhoa())) {
            throw new IllegalArgumentException("Mã khoa đã tồn tại: " + khoaDTO.getMaKhoa());
        }
        Khoa khoa = Khoa_Mapp.toEntity(khoaDTO);
        Khoa savedKhoa = khoaRepository.save(khoa);
        return Khoa_Mapp.toDTOResp(savedKhoa);
    }

    @Override
    public Khoa_DTO_Resp update(String maKhoa, Khoa_DTO_Req khoaDTO) {
        Khoa khoa = khoaRepository.findById(maKhoa)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa với mã: " + maKhoa));
        khoa.setTenKhoa(khoaDTO.getTenKhoa());
        Khoa updatedKhoa = khoaRepository.save(khoa);
        return Khoa_Mapp.toDTOResp(updatedKhoa);
    }

    @Override
    public void delete(String maKhoa) {
        if (!khoaRepository.existsById(maKhoa)) {
            throw new NotFoundException("Không tìm thấy khoa với mã: " + maKhoa);
        }
        khoaRepository.deleteById(maKhoa);
    }
}