package com.example.student.management.service.impl;

import com.example.student.management.dto.req.SinhVien_DTO_Req;
import com.example.student.management.dto.resp.SinhVien_DTO_Resp;
import com.example.student.management.entity.KhoaHoc;
import com.example.student.management.entity.Lop;
import com.example.student.management.entity.SinhVien;
import com.example.student.management.enums.GioiTinh;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.SinhVien_Mapp;
import com.example.student.management.repository.KhoaHoc_Repository;
import com.example.student.management.repository.Lop_Repository;
import com.example.student.management.repository.SinhVien_Repository;
import com.example.student.management.service.SinhVien_Service;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class SinhVien_Impl implements SinhVien_Service {

    @Autowired
    private SinhVien_Repository sinhVienRepository;

    @Autowired
    private Lop_Repository lopRepository;

    @Autowired
    private KhoaHoc_Repository khoaHocRepository;

    @Override
    public Page<SinhVien_DTO_Resp> getAll(Pageable pageable) {
        return sinhVienRepository.findAll(pageable).map(SinhVien_Mapp::toDTOResp);
    }

    @Override
    public Page<SinhVien_DTO_Resp> searchAndFilter(String keyword, String maLop, String maKhoa, String maKhoaHoc, Pageable pageable) {
        return sinhVienRepository.findByMaSVOrHoVaTenAndFilters(keyword, maLop, maKhoa, maKhoaHoc, pageable)
                .map(SinhVien_Mapp::toDTOResp);
    }

    @Override
    public List<SinhVien_DTO_Resp> getSinhVienByMaLop(String maLop) {
        List<SinhVien> sinhViens = sinhVienRepository.findByMaLop(maLop);
        return SinhVien_Mapp.toDTORespList(sinhViens);
    }

    @Override
    public List<SinhVien_DTO_Resp> getSinhVienByLopTinChiId(int id) {
        List<SinhVien> sinhViens = sinhVienRepository.findByLopTinChiId(id);
        return SinhVien_Mapp.toDTORespList(sinhViens);
    }

    @Override
    public SinhVien_DTO_Resp create(SinhVien_DTO_Req dto) {
        if (sinhVienRepository.existsById(dto.getMaSV())) {
            throw new IllegalArgumentException("Mã sinh viên đã tồn tại: " + dto.getMaSV());
        }
        Lop lop = lopRepository.findById(dto.getMaLop())
                .orElseThrow(() -> new NotFoundException("Lớp không tồn tại: " + dto.getMaLop()));
        KhoaHoc khoaHoc = khoaHocRepository.findById(dto.getMaKhoaHoc())
                .orElseThrow(() -> new NotFoundException("Khóa học không tồn tại: " + dto.getMaKhoaHoc()));
        SinhVien sinhVien = SinhVien_Mapp.toEntity(dto, lop, khoaHoc);
        SinhVien savedSinhVien = sinhVienRepository.save(sinhVien);
        return SinhVien_Mapp.toDTOResp(savedSinhVien);
    }

    @Override
    public SinhVien_DTO_Resp update(String maSV, SinhVien_DTO_Req dto) {
        SinhVien sinhVien = sinhVienRepository.findById(maSV)
                .orElseThrow(() -> new NotFoundException("Sinh viên không tồn tại: " + maSV));
        Lop lop = lopRepository.findById(dto.getMaLop())
                .orElseThrow(() -> new NotFoundException("Lớp không tồn tại: " + dto.getMaLop()));
        KhoaHoc khoaHoc = khoaHocRepository.findById(dto.getMaKhoaHoc())
                .orElseThrow(() -> new NotFoundException("Khóa học không tồn tại: " + dto.getMaKhoaHoc()));
        sinhVien.setHoVaTen(dto.getHoVaTen());
        sinhVien.setNgaySinh(dto.getNgaySinh());
        sinhVien.setGioiTinh(dto.getGioiTinh());
        sinhVien.setLop(lop);
        sinhVien.setKhoaHoc(khoaHoc);
        sinhVien.setEmail(dto.getEmail());
        SinhVien updatedSinhVien = sinhVienRepository.save(sinhVien);
        return SinhVien_Mapp.toDTOResp(updatedSinhVien);
    }

    @Override
    public void delete(String maSV) {
        if (!sinhVienRepository.existsById(maSV)) {
            throw new NotFoundException("Sinh viên không tồn tại: " + maSV);
        }
        sinhVienRepository.deleteById(maSV);
    }

    @Override
    public SinhVien_DTO_Resp getById(String maSV) {
        SinhVien sinhVien = sinhVienRepository.findById(maSV)
                .orElseThrow(() -> new NotFoundException("Sinh viên không tồn tại: " + maSV));
        return SinhVien_Mapp.toDTOResp(sinhVien);
    }

    @Override
    public List<SinhVien_DTO_Resp> getAllForExport() {
        return SinhVien_Mapp.toDTORespList(sinhVienRepository.findAll());
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<SinhVien_DTO_Resp> sinhViens) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("SinhVien");
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Mã SV", "Họ và Tên", "Ngày Sinh", "Giới Tính", "Email"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }
            int rowIdx = 1;
            for (SinhVien_DTO_Resp sv : sinhViens) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(sv.getMaSV());
                row.createCell(1).setCellValue(sv.getHoVaTen());
                row.createCell(2).setCellValue(sv.getNgaySinh() != null ? sv.getNgaySinh().toString() : "");
                row.createCell(3).setCellValue(sv.getGioiTinh() != null ? sv.getGioiTinh().name() : "");
                row.createCell(4).setCellValue(sv.getEmail());
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi xuất Excel: " + e.getMessage());
        }
    }

    @Override
    public List<SinhVien_DTO_Resp> importFromExcel(MultipartFile file) {
        List<SinhVien_DTO_Resp> importedSinhViens = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                SinhVien_DTO_Req dto = new SinhVien_DTO_Req();
                dto.setMaSV(getCellValue(row.getCell(0)));
                dto.setHoVaTen(getCellValue(row.getCell(1)));
                String ngaySinhStr = getCellValue(row.getCell(2));
                if (!ngaySinhStr.isEmpty()) {
                    dto.setNgaySinh(LocalDate.parse(ngaySinhStr));
                }
                String gioiTinhStr = getCellValue(row.getCell(3));
                if (!gioiTinhStr.isEmpty()) {
                    dto.setGioiTinh(GioiTinh.valueOf(gioiTinhStr));
                }
                dto.setEmail(getCellValue(row.getCell(4)));
                dto.setMaLop("DEFAULT_LOP");
                dto.setMaKhoaHoc("DEFAULT_KHOA_HOC");

                if (sinhVienRepository.existsById(dto.getMaSV())) {
                    importedSinhViens.add(update(dto.getMaSV(), dto));
                } else {
                    importedSinhViens.add(create(dto));
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("Lỗi khi nhập Excel: " + e.getMessage());
        }
        return importedSinhViens;
    }

    private String getCellValue(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf((int) cell.getNumericCellValue());
            default:
                return "";
        }
    }
}