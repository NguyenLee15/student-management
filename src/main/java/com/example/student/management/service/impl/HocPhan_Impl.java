package com.example.student.management.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.student.management.dto.req.HocPhan_DTO_Req;
import com.example.student.management.dto.resp.HocPhan_DTO_Resp;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.Khoa;
import com.example.student.management.enums.LoaiHocPhan;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.HocPhan_Mapp;
import com.example.student.management.repository.HocPhan_Repository;
import com.example.student.management.repository.Khoa_Repository;
import com.example.student.management.service.HocPhan_Service;

@Service
public class HocPhan_Impl implements HocPhan_Service {

    @Autowired
    private HocPhan_Repository hocPhanRepository;

    @Autowired
    private Khoa_Repository khoaRepository;

    @Override
    public Page<HocPhan_DTO_Resp> getAll(int page, int size) {
        return hocPhanRepository.findAll(PageRequest.of(page, size)).map(HocPhan_Mapp::toDTOResp);
    }

    @Override
    public Optional<HocPhan_DTO_Resp> getById(String maHocPhan) {
        return hocPhanRepository.findById(maHocPhan).map(HocPhan_Mapp::toDTOResp);
    }

    @Override
    public HocPhan_DTO_Resp create(HocPhan_DTO_Req hocPhanDTO) {
        Khoa khoa = khoaRepository.findById(hocPhanDTO.getMaKhoa())
                .orElseThrow(() -> new NotFoundException("Khoa không tồn tại: " + hocPhanDTO.getMaKhoa()));
        HocPhan hocPhan = HocPhan_Mapp.toEntity(hocPhanDTO, khoa);
        HocPhan savedHocPhan = hocPhanRepository.save(hocPhan);
        return HocPhan_Mapp.toDTOResp(savedHocPhan);
    }

    @Override
    public HocPhan_DTO_Resp update(String maHocPhan, HocPhan_DTO_Req hocPhanDTO) {
        HocPhan hocPhan = hocPhanRepository.findById(maHocPhan)
                .orElseThrow(() -> new NotFoundException("Học phần không tồn tại: " + maHocPhan));
        Khoa khoa = khoaRepository.findById(hocPhanDTO.getMaKhoa())
                .orElseThrow(() -> new NotFoundException("Khoa không tồn tại: " + hocPhanDTO.getMaKhoa()));
        hocPhan.setTenHocPhan(hocPhanDTO.getTenHocPhan());
        hocPhan.setLoaiHocPhan(hocPhanDTO.getLoaiHocPhan());
        hocPhan.setSoTinChi(hocPhanDTO.getSoTinChi());
        hocPhan.setSoTienTinChi(hocPhanDTO.getSoTienTinChi());
        hocPhan.setKhoa(khoa);
        HocPhan updatedHocPhan = hocPhanRepository.save(hocPhan);
        return HocPhan_Mapp.toDTOResp(updatedHocPhan);
    }

    @Override
    public void delete(String maHocPhan) {
        if (!hocPhanRepository.existsById(maHocPhan)) {
            throw new NotFoundException("Học phần không tồn tại: " + maHocPhan);
        }
        hocPhanRepository.deleteById(maHocPhan);
    }

    @Override
    public Page<HocPhan_DTO_Resp> searchByLoaiHocPhan(LoaiHocPhan loaiHocPhan, int page, int size) {
        return hocPhanRepository.findByLoaiHocPhan(loaiHocPhan, PageRequest.of(page, size))
                .map(HocPhan_Mapp::toDTOResp);
    }

    @Override
    public Page<HocPhan_DTO_Resp> searchByMaKhoa(String maKhoa, int page, int size) {
        return hocPhanRepository.findByKhoa_MaKhoa(maKhoa, PageRequest.of(page, size))
                .map(HocPhan_Mapp::toDTOResp);
    }

    @Override
    public ByteArrayInputStream exportToExcel(Page<HocPhan_DTO_Resp> hocPhanPage) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("HocPhan");
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Mã Học Phần", "Tên Học Phần", "Loại Học Phần", "Số Tín Chỉ", "Số Tiền Tín Chỉ", "Mã Khoa", "Tên Khoa"};
            for (int i = 0; i < columns.length; i++) {
                headerRow.createCell(i).setCellValue(columns[i]);
            }
            int rowIdx = 1;
            for (HocPhan_DTO_Resp hp : hocPhanPage.getContent()) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(hp.getMaHocPhan());
                row.createCell(1).setCellValue(hp.getTenHocPhan());
                row.createCell(2).setCellValue(hp.getLoaiHocPhan().name());
                row.createCell(3).setCellValue(hp.getSoTinChi());
                row.createCell(4).setCellValue(hp.getSoTienTinChi());
                row.createCell(5).setCellValue(hp.getMaKhoa());
                row.createCell(6).setCellValue(hp.getTenKhoa());
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xuất Excel: " + e.getMessage());
        }
    }

    @Override
    public void importFromExcel(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                HocPhan_DTO_Req dto = new HocPhan_DTO_Req();
                dto.setMaHocPhan(row.getCell(0).getStringCellValue());
                dto.setTenHocPhan(row.getCell(1).getStringCellValue());
                dto.setLoaiHocPhan(LoaiHocPhan.valueOf(row.getCell(2).getStringCellValue()));
                dto.setSoTinChi((int) row.getCell(3).getNumericCellValue());
                dto.setSoTienTinChi((int) row.getCell(4).getNumericCellValue());
                dto.setMaKhoa(row.getCell(5).getStringCellValue());

                if (hocPhanRepository.existsById(dto.getMaHocPhan())) {
                    update(dto.getMaHocPhan(), dto);
                } else {
                    create(dto);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi nhập Excel: " + e.getMessage());
        }
    }
    
    @Override
    public List<HocPhan_DTO_Resp> getAll() {
		return hocPhanRepository.findAll().stream()
				.map(HocPhan_Mapp::toDTOResp)
				.toList();
	}
}