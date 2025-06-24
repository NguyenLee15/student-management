package com.example.student.management.service.impl;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.student.management.dto.req.Lop_DTO_Req;
import com.example.student.management.dto.resp.Lop_DTO_Resp;
import com.example.student.management.entity.Khoa;
import com.example.student.management.entity.Lop;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.Lop_Mapp;
import com.example.student.management.repository.Khoa_Repository;
import com.example.student.management.repository.Lop_Repository;
import com.example.student.management.service.Lop_Service;

@Service
public class Lop_Impl implements Lop_Service {

    @Autowired
    private Lop_Repository lopRepository;

    @Autowired
    private Khoa_Repository khoaRepository;

    @Override
    public Page<Lop_DTO_Resp> getByMaKhoa(String maKhoa, Pageable pageable) {
        return lopRepository.findByKhoa_MaKhoa(maKhoa, pageable).map(Lop_Mapp::toDTOResp);
    }

    @Override
    public Page<Lop_DTO_Resp> getAll(Pageable pageable) {
        return lopRepository.findAll(pageable).map(Lop_Mapp::toDTOResp);
    }
    
    @Override
    public List<Lop_DTO_Resp> getAll() {
		List<Lop> lops = lopRepository.findAll();
		List<Lop_DTO_Resp> dtoList = new ArrayList<>();
		for (Lop lop : lops) {
			dtoList.add(Lop_Mapp.toDTOResp(lop));
		}
		return dtoList;
	}

    @Override
    public Lop_DTO_Resp create(Lop_DTO_Req dto) {
        Khoa khoa = khoaRepository.findById(dto.getMaKhoa())
                .orElseThrow(() -> new NotFoundException("Khoa không tồn tại: " + dto.getMaKhoa()));
        Lop lop = Lop_Mapp.toEntity(dto, khoa);
        Lop savedLop = lopRepository.save(lop);
        return Lop_Mapp.toDTOResp(savedLop);
    }

    @Override
    public Lop_DTO_Resp update(String maLop, Lop_DTO_Req dto) {
        Lop lop = lopRepository.findById(maLop)
                .orElseThrow(() -> new NotFoundException("Lớp không tồn tại: " + maLop));
        Khoa khoa = khoaRepository.findById(dto.getMaKhoa())
                .orElseThrow(() -> new NotFoundException("Khoa không tồn tại: " + dto.getMaKhoa()));
        lop.setTenLop(dto.getTenLop());
        lop.setKhoa(khoa);
        Lop updatedLop = lopRepository.save(lop);
        return Lop_Mapp.toDTOResp(updatedLop);
    }

    @Override
    public void delete(String maLop) {
        if (!lopRepository.existsById(maLop)) {
            throw new NotFoundException("Lớp không tồn tại: " + maLop);
        }
        lopRepository.deleteById(maLop);
    }

    @Override
    public boolean existsById(String maLop) {
        return lopRepository.existsById(maLop);
    }

    @Override
    public Lop_DTO_Resp getById(String maLop) {
        return lopRepository.findById(maLop)
                .map(Lop_Mapp::toDTOResp)
                .orElseThrow(() -> new NotFoundException("Lớp không tồn tại: " + maLop));
    }

    public ByteArrayInputStream exportToExcel(List<Lop_DTO_Resp> lopList) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Lop");
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Mã Lớp", "Tên Lớp", "Mã Khoa", "Tên Khoa"};
            for (int i = 0; i < columns.length; i++) {
                headerRow.createCell(i).setCellValue(columns[i]);
            }
            int rowIdx = 1;
            for (Lop_DTO_Resp lop : lopList) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(lop.getMaLop());
                row.createCell(1).setCellValue(lop.getTenLop());
                row.createCell(2).setCellValue(lop.getMaKhoa());
                row.createCell(3).setCellValue(lop.getTenKhoa());
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi xuất Excel: " + e.getMessage());
        }
    }

    public void importFromExcel(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                Lop_DTO_Req dto = new Lop_DTO_Req();
                dto.setMaLop(row.getCell(0).getStringCellValue());
                dto.setTenLop(row.getCell(1).getStringCellValue());
                dto.setMaKhoa(row.getCell(2).getStringCellValue());

                if (existsById(dto.getMaLop())) {
                    update(dto.getMaLop(), dto);
                } else {
                    create(dto);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi nhập Excel: " + e.getMessage());
        }
    }
}