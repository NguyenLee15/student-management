package com.example.student.management.service.impl;

import com.example.student.management.dto.req.LopTinChi_DTO_Req;
import com.example.student.management.dto.resp.LopTinChi_DTO_Resp;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.LopTinChi;
import com.example.student.management.entity.LopTinChiSinhVien;
import com.example.student.management.entity.SinhVien;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.LopTinChi_Mapp;
import com.example.student.management.repository.HocPhan_Repository;
import com.example.student.management.repository.LopTinChi_Repository;
import com.example.student.management.repository.LopTinChiSinhVien_Repository;
import com.example.student.management.repository.SinhVien_Repository;
import com.example.student.management.service.LopTinChi_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LopTinChi_Impl implements LopTinChi_Service {

    @Autowired
    private LopTinChi_Repository lopTinChiRepository;

    @Autowired
    private HocPhan_Repository hocPhanRepository;

    @Autowired
    private SinhVien_Repository sinhVienRepository;

    @Autowired
    private LopTinChiSinhVien_Repository lopTinChiSinhVienRepository;

    @Override
    public List<LopTinChi_DTO_Resp> getAll() {
        return LopTinChi_Mapp.toDTORespList(lopTinChiRepository.findAll());
    }

    @Override
    public Page<LopTinChi_DTO_Req> getAllLopTinChi(int page, int size) {
        return lopTinChiRepository.findAll(PageRequest.of(page, size))
                .map(LopTinChi_Mapp::toDTOReq);
    }

    @Override
    public LopTinChi_DTO_Req getLopTinChiById(int id) {
        LopTinChi lopTinChi = lopTinChiRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lớp tín chỉ không tồn tại: " + id));
        return LopTinChi_Mapp.toDTOReq(lopTinChi);
    }

    @Override
    public void saveLopTinChi(LopTinChi_DTO_Req request) {
        if (lopTinChiRepository.existsByLopTinChiId(request.getLopTinChiId())) {
            throw new IllegalArgumentException("Mã lớp tín chỉ đã tồn tại: " + request.getLopTinChiId());
        }
        HocPhan hocPhan = hocPhanRepository.findById(request.getMaHocPhan())
                .orElseThrow(() -> new NotFoundException("Học phần không tồn tại: " + request.getMaHocPhan()));
        LopTinChi lopTinChi = LopTinChi_Mapp.toEntity(request, hocPhan);
        lopTinChiRepository.save(lopTinChi);
    }

    @Override
    public void updateLopTinChi(int id, LopTinChi_DTO_Req request) {
        LopTinChi lopTinChi = lopTinChiRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lớp tín chỉ không tồn tại: " + id));
        if (!lopTinChi.getLopTinChiId().equals(request.getLopTinChiId()) &&
                lopTinChiRepository.existsByLopTinChiId(request.getLopTinChiId())) {
            throw new IllegalArgumentException("Mã lớp tín chỉ đã tồn tại: " + request.getLopTinChiId());
        }
        HocPhan hocPhan = hocPhanRepository.findById(request.getMaHocPhan())
                .orElseThrow(() -> new NotFoundException("Học phần không tồn tại: " + request.getMaHocPhan()));
        lopTinChi.setLopTinChiId(request.getLopTinChiId());
        lopTinChi.setTenLopTinChi(request.getTenLopTinChi());
        lopTinChi.setHocPhan(hocPhan);
        lopTinChiRepository.save(lopTinChi);
    }

    @Override
    public void deleteLopTinChi(int id) {
        if (!lopTinChiRepository.existsById(id)) {
            throw new NotFoundException("Lớp tín chỉ không tồn tại: " + id);
        }
        lopTinChiRepository.deleteById(id);
    }

    @Override
    public void addStudentsToLopTinChi(int id, List<String> maSinhViens) {
        LopTinChi lopTinChi = lopTinChiRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lớp tín chỉ không tồn tại: " + id));
        for (String maSinhVien : maSinhViens) {
            SinhVien sinhVien = sinhVienRepository.findById(maSinhVien)
                    .orElseThrow(() -> new NotFoundException("Sinh viên không tồn tại: " + maSinhVien));
            if (lopTinChiSinhVienRepository.existsByLopTinChiAndSinhVien(lopTinChi, sinhVien)) {
                continue; // Bỏ qua nếu sinh viên đã có trong lớp
            }
            LopTinChiSinhVien lopTinChiSinhVien = new LopTinChiSinhVien();
            lopTinChiSinhVien.setLopTinChi(lopTinChi);
            lopTinChiSinhVien.setSinhVien(sinhVien);
            lopTinChiSinhVienRepository.save(lopTinChiSinhVien);
        }
    }

    @Override
    public void removeStudentFromLopTinChi(int id, String maSinhVien) {
        LopTinChi lopTinChi = lopTinChiRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Lớp tín chỉ không tồn tại: " + id));
        SinhVien sinhVien = sinhVienRepository.findById(maSinhVien)
                .orElseThrow(() -> new NotFoundException("Sinh viên không tồn tại: " + maSinhVien));
        LopTinChiSinhVien lopTinChiSinhVien = lopTinChiSinhVienRepository.findByLopTinChiAndSinhVien(lopTinChi, sinhVien)
                .orElseThrow(() -> new NotFoundException("Sinh viên không có trong lớp tín chỉ"));
        lopTinChiSinhVienRepository.delete(lopTinChiSinhVien);
    }
}