package com.example.student.management.service.impl;

import com.example.student.management.dto.req.DiemHocTap_DTO_Req;
import com.example.student.management.dto.resp.DiemHocTap_DTO_Resp;
import com.example.student.management.entity.DiemHocTap;
import com.example.student.management.entity.HocPhan;
import com.example.student.management.entity.SinhVien;
import com.example.student.management.enums.Dot;
import com.example.student.management.enums.HocKi;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.mapping.DiemHocTap_Mapp;
import com.example.student.management.repository.DiemHocTap_Repository;
import com.example.student.management.repository.HocPhan_Repository;
import com.example.student.management.repository.SinhVien_Repository;
import com.example.student.management.service.DiemHocTap_Service;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiemHocTap_Impl implements DiemHocTap_Service {

    private static final Logger logger = LoggerFactory.getLogger(DiemHocTap_Impl.class);

    private final DiemHocTap_Repository diemHocTapRepository;
    private final SinhVien_Repository sinhVienRepository;
    private final HocPhan_Repository hocPhanRepository;

    @Override
    public Page<DiemHocTap_DTO_Resp> findAll(Pageable pageable) {
        return diemHocTapRepository.findAll(pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public DiemHocTap_DTO_Resp findById(Integer id) {
        DiemHocTap diemHocTap = diemHocTapRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Điểm học tập không tồn tại."));
        return DiemHocTap_Mapp.toDTOResp(diemHocTap);
    }

    @Override
    public DiemHocTap_DTO_Resp create(DiemHocTap_DTO_Req requestDTO) {
        logger.debug("Tạo điểm học tập: maSV={}, maHocPhan={}, hocKy={}, namHoc={}, dot={}",
                requestDTO.getMaSV(), requestDTO.getMaHocPhan(), requestDTO.getHocKy(), requestDTO.getNamHoc(), requestDTO.getDot());

        SinhVien sinhVien = sinhVienRepository.findById(requestDTO.getMaSV())
                .orElseThrow(() -> new NotFoundException("Sinh viên không tồn tại."));
        HocPhan hocPhan = hocPhanRepository.findById(requestDTO.getMaHocPhan())
                .orElseThrow(() -> new NotFoundException("Học phần không tồn tại."));
        validateDiem(requestDTO);

        if (diemHocTapRepository.existsByUniqueConstraint(
                requestDTO.getMaSV(),
                requestDTO.getMaHocPhan(),
                requestDTO.getHocKy(),
                requestDTO.getNamHoc(),
                requestDTO.getDot(),
                null)) {
            logger.warn("Trùng lặp khi tạo: maSV={}, maHocPhan={}, hocKy={}, namHoc={}, dot={}",
                    requestDTO.getMaSV(), requestDTO.getMaHocPhan(), requestDTO.getHocKy(), requestDTO.getNamHoc(), requestDTO.getDot());
            throw new IllegalArgumentException("Điểm học tập đã tồn tại cho sinh viên, học phần, học kỳ, năm học và đợt này.");
        }

        BigDecimal diemThang10 = requestDTO.getDiemThang10();
        requestDTO.setDiemThang4(calculateDiemThang4(diemThang10));
        requestDTO.setDiemChu(calculateDiemChu(diemThang10));
        logger.debug("Tính điểm: diemThang10={}, diemThang4={}, diemChu={}", 
                diemThang10, requestDTO.getDiemThang4(), requestDTO.getDiemChu());

        DiemHocTap diemHocTap = DiemHocTap_Mapp.toEntity(requestDTO, sinhVien, hocPhan);
        diemHocTapRepository.save(diemHocTap);
        logger.debug("Tạo thành công: id={}", diemHocTap.getDiemHocTapId());
        return DiemHocTap_Mapp.toDTOResp(diemHocTap);
    }

    @Override
    public DiemHocTap_DTO_Resp update(Integer id, DiemHocTap_DTO_Req requestDTO) {
        logger.debug("Cập nhật điểm học tập: id={}, maSV={}, maHocPhan={}, hocKy={}, namHoc={}, dot={}",
                id, requestDTO.getMaSV(), requestDTO.getMaHocPhan(), requestDTO.getHocKy(), requestDTO.getNamHoc(), requestDTO.getDot());

        DiemHocTap diemHocTap = diemHocTapRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Điểm học tập không tồn tại."));
        SinhVien sinhVien = sinhVienRepository.findById(requestDTO.getMaSV())
                .orElseThrow(() -> new NotFoundException("Sinh viên không tồn tại."));
        HocPhan hocPhan = hocPhanRepository.findById(requestDTO.getMaHocPhan())
                .orElseThrow(() -> new NotFoundException("Học phần không tồn tại."));
        validateDiem(requestDTO);

        boolean exists = diemHocTapRepository.existsByUniqueConstraint(
                requestDTO.getMaSV(),
                requestDTO.getMaHocPhan(),
                requestDTO.getHocKy(),
                requestDTO.getNamHoc(),
                requestDTO.getDot(),
                id);
        logger.debug("Kiểm tra trùng lặp: exists={}, id={}", exists, id);
        if (exists) {
            logger.warn("Trùng lặp khi cập nhật: id={}, maSV={}, maHocPhan={}, hocKy={}, namHoc={}, dot={}",
                    id, requestDTO.getMaSV(), requestDTO.getMaHocPhan(), requestDTO.getHocKy(), requestDTO.getNamHoc(), requestDTO.getDot());
            throw new IllegalArgumentException("Điểm học tập đã tồn tại cho sinh viên, học phần, học kỳ, năm học và đợt này.");
        }

        BigDecimal diemThang10 = requestDTO.getDiemThang10();
        requestDTO.setDiemThang4(calculateDiemThang4(diemThang10));
        requestDTO.setDiemChu(calculateDiemChu(diemThang10));
        logger.debug("Tính điểm: diemThang10={}, diemThang4={}, diemChu={}", 
                diemThang10, requestDTO.getDiemThang4(), requestDTO.getDiemChu());

        if (requestDTO.getDiemChu() != null && requestDTO.getDiemChu().length() > 2) {
            logger.error("Giá trị diemChu quá dài: {}", requestDTO.getDiemChu());
            throw new IllegalArgumentException("Giá trị điểm chữ quá dài, tối đa 2 ký tự.");
        }

        diemHocTap.setSinhVien(sinhVien);
        diemHocTap.setHocPhan(hocPhan);
        diemHocTap.setHocKy(requestDTO.getHocKy());
        diemHocTap.setNamHoc(requestDTO.getNamHoc());
        diemHocTap.setDot(requestDTO.getDot());
        diemHocTap.setDiemThang10(requestDTO.getDiemThang10());
        diemHocTap.setDiemThang4(requestDTO.getDiemThang4());
        diemHocTap.setDiemChu(requestDTO.getDiemChu());
        diemHocTapRepository.save(diemHocTap);
        logger.debug("Cập nhật thành công: id={}", id);
        return DiemHocTap_Mapp.toDTOResp(diemHocTap);
    }

    @Override
    public void delete(Integer id) {
        if (!diemHocTapRepository.existsById(id)) {
            throw new NotFoundException("Điểm học tập không tồn tại.");
        }
        diemHocTapRepository.deleteById(id);
        logger.debug("Xóa thành công: id={}", id);
    }

    @Override
    public Page<DiemHocTap_DTO_Resp> findByMaSV(String maSV, Pageable pageable) {
        return diemHocTapRepository.findBySinhVien_MaSinhVien(maSV, pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public Page<DiemHocTap_DTO_Resp> findByMaHocPhan(String maHocPhan, Pageable pageable) {
        return diemHocTapRepository.findByMaHocPhan(maHocPhan, pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public Page<DiemHocTap_DTO_Resp> findByHocKy(HocKi hocKy, Pageable pageable) {
        return diemHocTapRepository.findByHocKy(hocKy, pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public Page<DiemHocTap_DTO_Resp> findByDot(Dot dot, Pageable pageable) {
        return diemHocTapRepository.findByDot(dot, pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public Page<DiemHocTap_DTO_Resp> findByMaLop(String maLop, Pageable pageable) {
        return diemHocTapRepository.findByMaLop(maLop, pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public Page<DiemHocTap_DTO_Resp> findByMaKhoaHoc(String maKhoaHoc, Pageable pageable) {
        return diemHocTapRepository.findByMaKhoaHoc(maKhoaHoc, pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public Page<DiemHocTap_DTO_Resp> findByMaKhoa(String maKhoa, Pageable pageable) {
        return diemHocTapRepository.findByMaKhoa(maKhoa, pageable)
                .map(DiemHocTap_Mapp::toDTOResp);
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<DiemHocTap_DTO_Resp> diemHocTaps) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("DiemHocTap");
            Row headerRow = sheet.createRow(0);
            String[] columns = {"ID", "Mã SV", "Tên SV", "Mã Học Phần", "Tên Học Phần", "Học Kỳ", "Năm Học", "Đợt", "Điểm Thang 10", "Điểm Thang 4", "Điểm Chữ"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }
            int rowIdx = 1;
            for (DiemHocTap_DTO_Resp diem : diemHocTaps) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(diem.getDiemHocTapID());
                row.createCell(1).setCellValue(diem.getMaSV());
                row.createCell(2).setCellValue(diem.getTenSV());
                row.createCell(3).setCellValue(diem.getMaHocPhan());
                row.createCell(4).setCellValue(diem.getTenHocPhan());
                row.createCell(5).setCellValue(diem.getHocKy().getValue());
                row.createCell(6).setCellValue(diem.getNamHoc());
                row.createCell(7).setCellValue(diem.getDot().getDotHoc());
                row.createCell(8).setCellValue(diem.getDiemThang10().doubleValue());
                row.createCell(9).setCellValue(diem.getDiemThang4().doubleValue());
                row.createCell(10).setCellValue(diem.getDiemChu());
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Lỗi khi xuất Excel: {}", e.getMessage());
            throw new RuntimeException("Lỗi khi xuất Excel: " + e.getMessage());
        }
    }

    @Override
    public List<DiemHocTap_DTO_Resp> importFromExcel(MultipartFile file) {
        List<DiemHocTap_DTO_Resp> importedDiemHocTaps = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                DiemHocTap_DTO_Req dto = new DiemHocTap_DTO_Req();
                dto.setMaSV(getCellValueAsString(row.getCell(1)));
                dto.setMaHocPhan(getCellValueAsString(row.getCell(3)));
                String hocKyStr = getCellValueAsString(row.getCell(5));
                try {
                    dto.setHocKy(HocKi.valueOf(hocKyStr.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    for (HocKi hk : HocKi.values()) {
                        if (hk.getValue().equalsIgnoreCase(hocKyStr)) {
                            dto.setHocKy(hk);
                            break;
                        }
                    }
                    if (dto.getHocKy() == null) {
                        throw new IllegalArgumentException("Học kỳ không hợp lệ tại dòng " + (i + 1) + ": " + hocKyStr);
                    }
                }
                dto.setNamHoc(getCellValueAsString(row.getCell(6)));
                String dotStr = getCellValueAsString(row.getCell(7));
                try {
                    dto.setDot(Dot.valueOf(dotStr.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    for (Dot d : Dot.values()) {
                        if (d.getDotHoc().equalsIgnoreCase(dotStr)) {
                            dto.setDot(d);
                            break;
                        }
                    }
                    if (dto.getDot() == null) {
                        throw new IllegalArgumentException("Đợt không hợp lệ tại dòng " + (i + 1) + ": " + dotStr);
                    }
                }
                BigDecimal diemThang10;
                try {
                    diemThang10 = new BigDecimal(getCellValueAsString(row.getCell(8)));
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Điểm thang 10 không hợp lệ tại dòng " + (i + 1));
                }
                dto.setDiemThang10(diemThang10);
                dto.setDiemThang4(calculateDiemThang4(diemThang10));
                dto.setDiemChu(calculateDiemChu(diemThang10));
                logger.debug("Nhập Excel dòng {}: diemThang10={}, diemThang4={}, diemChu={}", 
                        i + 1, diemThang10, dto.getDiemThang4(), dto.getDiemChu());

                if (diemHocTapRepository.existsByUniqueConstraint(
                        dto.getMaSV(),
                        dto.getMaHocPhan(),
                        dto.getHocKy(),
                        dto.getNamHoc(),
                        dto.getDot(),
                        null)) {
                    logger.warn("Trùng lặp khi nhập Excel tại dòng {}: maSV={}, maHocPhan={}, hocKy={}, namHoc={}, dot={}",
                            (i + 1), dto.getMaSV(), dto.getMaHocPhan(), dto.getHocKy(), dto.getNamHoc(), dto.getDot());
                    throw new IllegalArgumentException("Điểm học tập đã tồn tại tại dòng " + (i + 1) + " cho sinh viên, học phần, học kỳ, năm học và đợt này.");
                }

                DiemHocTap_DTO_Resp resp = create(dto);
                importedDiemHocTaps.add(resp);
            }
        } catch (IOException e) {
            logger.error("Lỗi khi nhập Excel: {}", e.getMessage());
            throw new RuntimeException("Lỗi khi nhập Excel: " + e.getMessage());
        }
        return importedDiemHocTaps;
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            default:
                return "";
        }
    }

    private void validateDiem(DiemHocTap_DTO_Req dto) {
        if (dto.getDiemThang10() == null || dto.getDiemThang10().compareTo(BigDecimal.ZERO) < 0 || dto.getDiemThang10().compareTo(new BigDecimal("10.0")) > 0) {
            throw new IllegalArgumentException("Điểm thang 10 phải từ 0 đến 10.");
        }
        if (dto.getNamHoc() == null || !dto.getNamHoc().matches("\\d{4}-\\d{4}")) {
            throw new IllegalArgumentException("Năm học phải theo định dạng xxxx-yyyy.");
        }
        if (dto.getMaSV() == null || dto.getMaSV().isEmpty()) {
            throw new IllegalArgumentException("Mã sinh viên không được để trống.");
        }
        if (dto.getMaHocPhan() == null || dto.getMaHocPhan().isEmpty()) {
            throw new IllegalArgumentException("Mã học phần không được để trống.");
        }
        if (dto.getHocKy() == null) {
            throw new IllegalArgumentException("Học kỳ không được để trống.");
        }
        if (dto.getDot() == null) {
            throw new IllegalArgumentException("Đợt không được để trống.");
        }
    }

    private BigDecimal calculateDiemThang4(BigDecimal diemThang10) {
        if (diemThang10.compareTo(new BigDecimal("8.5")) >= 0) {
            return new BigDecimal("4.0");
        } else if (diemThang10.compareTo(new BigDecimal("7.0")) >= 0) {
            return new BigDecimal("3.5");
        } else if (diemThang10.compareTo(new BigDecimal("5.0")) >= 0) {
            return new BigDecimal("2.0");
        } else if (diemThang10.compareTo(new BigDecimal("4.0")) >= 0) {
            return new BigDecimal("2.0");
        } else {
            return BigDecimal.ZERO;
        }
    }

    private String calculateDiemChu(BigDecimal diemThang10) {
        if (diemThang10.compareTo(new BigDecimal("9.0")) >= 0) {
            return "A+";
        } else if (diemThang10.compareTo(new BigDecimal("8.5")) >= 0) {
            return "A";
        } else if (diemThang10.compareTo(new BigDecimal("8.0")) >= 0) {
            return "B+";
        } else if (diemThang10.compareTo(new BigDecimal("7.0")) >= 0) {
            return "B";
        } else if (diemThang10.compareTo(new BigDecimal("6.5")) >= 0) {
            return "C+";
        } else if (diemThang10.compareTo(new BigDecimal("5.5")) >= 0) {
            return "C";
        } else if (diemThang10.compareTo(new BigDecimal("5.0")) >= 0) {
            return "D+";
        } else if (diemThang10.compareTo(new BigDecimal("4.0")) >= 0) {
            return "D";
        } else {
            return "F";
        }
    }

	@Override
	public Page<DiemHocTap_DTO_Resp> findByDiemChu(String diemChu, Pageable pageable) {
		 return diemHocTapRepository.findByDiemChu(diemChu, pageable)
	           .map(DiemHocTap_Mapp::toDTOResp);
	}
}