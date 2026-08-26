package com.student.management.util;

import org.apache.poi.ss.usermodel.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.math.RoundingMode;

public class ExcelValidationUtils {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final int MAX_ROWS_ALLOWED = 5000;

    // Magic Bytes signatures
    private static final byte[] ZIP_MAGIC = {0x50, 0x4B, 0x03, 0x04}; // .xlsx
    private static final byte[] OLE2_MAGIC = {(byte) 0xD0, (byte) 0xCF, 0x11, (byte) 0xE0, (byte) 0xA1, (byte) 0xB1, 0x1A, (byte) 0xE1}; // .xls

    /**
     * Layer 1 + Layer 2: Pre-filter & Safe POI Workbook Loading
     */
    public static Workbook validateAndOpenWorkbook(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File Excel tải lên không được để trống.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("Dung lượng file vượt quá giới hạn cho phép (Tối đa 10MB).");
        }

        // Layer 1: Kiểm tra Magic Bytes
        try (InputStream is = new BufferedInputStream(file.getInputStream())) {
            byte[] header = new byte[8];
            int read = is.read(header);
            if (read < 4 || (!matchesMagic(header, ZIP_MAGIC) && !matchesMagic(header, OLE2_MAGIC))) {
                throw new IllegalArgumentException("File tải lên không phải là định dạng Excel (.xlsx / .xls) hợp lệ (Sai magic bytes).");
            }
        }

        // Layer 2: Mở Workbook an toàn qua POI Factory
        Workbook workbook;
        try {
            workbook = WorkbookFactory.create(file.getInputStream());
        } catch (Exception e) {
            throw new IllegalArgumentException("Không thể phân tích cấu trúc file Excel: " + e.getMessage(), e);
        }

        if (workbook.getNumberOfSheets() == 0) {
            throw new IllegalArgumentException("File Excel không chứa bất kỳ trang tính (sheet) nào.");
        }

        Sheet sheet = workbook.getSheetAt(0);
        int totalRows = sheet.getLastRowNum();
        if (totalRows > MAX_ROWS_ALLOWED) {
            throw new IllegalArgumentException("Số lượng dòng trong file Excel (" + totalRows + ") vượt quá ngưỡng an toàn (" + MAX_ROWS_ALLOWED + " dòng).");
        }

        return workbook;
    }

    private static boolean matchesMagic(byte[] header, byte[] magic) {
        if (header.length < magic.length) return false;
        for (int i = 0; i < magic.length; i++) {
            if (header[i] != magic[i]) return false;
        }
        return true;
    }

    /**
     * Layer 3: Tiện ích đọc dữ liệu ô an toàn
     */
    public static String getCellStringValue(Row row, int cellIndex, DataFormatter formatter) {
        if (row == null) return "";
        Cell cell = row.getCell(cellIndex);
        if (cell == null) return "";
        return formatter.formatCellValue(cell).trim();
    }

    public static BigDecimal getCellBigDecimalValue(Row row, int cellIndex, BigDecimal defaultValue) {
        if (row == null) return defaultValue;
        Cell cell = row.getCell(cellIndex);
        if (cell == null) return defaultValue;
        try {
            if (cell.getCellType() == CellType.NUMERIC) {
                return BigDecimal.valueOf(cell.getNumericCellValue()).setScale(2, RoundingMode.HALF_UP);
            }
            String str = cell.getStringCellValue().trim();
            if (str.isEmpty()) return defaultValue;
            return new BigDecimal(str).setScale(2, RoundingMode.HALF_UP);
        } catch (Exception e) {
            return defaultValue;
        }
    }
}
