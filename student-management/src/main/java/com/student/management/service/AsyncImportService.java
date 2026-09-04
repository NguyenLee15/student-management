// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.StudentRequestDto;
import com.student.management.entity.ImportTask;
import com.student.management.enums.Gender;
import com.student.management.repository.AcademicYearRepository;
import com.student.management.repository.ImportTaskRepository;
import com.student.management.repository.StudentClassRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AsyncImportService {

    private static final Logger logger = LoggerFactory.getLogger(AsyncImportService.class);
    
    private final ImportTaskRepository importTaskRepository;
    private final StudentService studentService;
    private final StudentClassRepository studentClassRepository;
    private final AcademicYearRepository academicYearRepository;

    public String startExcelImport(byte[] fileBytes) {
        String taskId = java.util.UUID.randomUUID().toString();
        ImportTask task = new ImportTask();
        task.setTaskId(taskId);
        task.setStatus("PENDING");
        importTaskRepository.save(task);

        processExcelImport(taskId, fileBytes);
        return taskId;
    }

    public com.student.management.dto.resp.ImportTaskResponseDto getTaskStatus(String taskId) {
        ImportTask task = importTaskRepository.findById(taskId)
                .orElseThrow(() -> new com.student.management.exception.BusinessException(
                        com.student.management.exception.ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy tiến trình import: " + taskId));
        return com.student.management.dto.resp.ImportTaskResponseDto.builder()
                .taskId(task.getTaskId())
                .status(task.getStatus())
                .totalRows(task.getTotalRows())
                .processedRows(task.getProcessedRows())
                .errorCount(task.getErrorCount())
                .errorDetails(task.getErrorDetails())
                .createdAt(task.getCreatedAt())
                .completedAt(task.getCompletedAt())
                .build();
    }

    @Async("taskExecutor")
    public void processExcelImport(String taskId, byte[] fileBytes) {
        ImportTask task = importTaskRepository.findById(taskId).orElse(null);
        if (task == null) return;
        
        task.setStatus("PROCESSING");
        importTaskRepository.save(task);

        try (Workbook workbook = new XSSFWorkbook(new ByteArrayInputStream(fileBytes))) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            
            int totalRows = sheet.getLastRowNum();
            task.setTotalRows(totalRows);
            importTaskRepository.save(task);

            int processed = 0;
            int errors = 0;
            StringBuilder errorDetails = new StringBuilder();

            for (int i = 1; i <= totalRows; i++) {
                try {
                    Row row = sheet.getRow(i);
                    if (row == null) continue;

                    String studentId = formatter.formatCellValue(row.getCell(0)).trim();
                    if (studentId.isEmpty()) continue;

                    StudentRequestDto dto = new StudentRequestDto();
                    dto.setStudentId(studentId);
                    dto.setFullName(formatter.formatCellValue(row.getCell(1)).trim());

                    Cell dateCell = row.getCell(2);
                    if (dateCell != null) {
                        if (DateUtil.isCellDateFormatted(dateCell)) {
                            dto.setDateOfBirth(dateCell.getLocalDateTimeCellValue().toLocalDate());
                        } else {
                            String dateStr = formatter.formatCellValue(dateCell).trim();
                            if (!dateStr.isEmpty()) {
                                dto.setDateOfBirth(LocalDate.parse(dateStr));
                            }
                        }
                    }

                    String genderStr = formatter.formatCellValue(row.getCell(3)).trim();
                    dto.setGender(parseGender(genderStr));
                    dto.setEmail(formatter.formatCellValue(row.getCell(4)).trim());

                    String classId = formatter.formatCellValue(row.getCell(5)).trim();
                    if (classId.isEmpty()) {
                        studentClassRepository.findAll().stream().findFirst().ifPresent(c -> dto.setClassId(c.getClassId()));
                    } else {
                        dto.setClassId(classId);
                    }

                    String academicYearId = formatter.formatCellValue(row.getCell(6)).trim();
                    if (academicYearId.isEmpty()) {
                        academicYearRepository.findAll().stream().findFirst().ifPresent(y -> dto.setAcademicYearId(y.getAcademicYearId()));
                    } else {
                        dto.setAcademicYearId(academicYearId);
                    }

                    if (dto.getClassId() != null && dto.getAcademicYearId() != null) {
                        studentService.saveOrUpdate(dto);
                    }

                    processed++;
                } catch (Exception e) {
                    errors++;
                    errorDetails.append("Row ").append(i).append(": ").append(e.getMessage()).append("\n");
                }

                if (i % 50 == 0) {
                    task.setProcessedRows(processed);
                    task.setErrorCount(errors);
                    importTaskRepository.save(task);
                }
            }

            task.setProcessedRows(processed);
            task.setErrorCount(errors);
            task.setErrorDetails(errorDetails.toString());
            task.setStatus(errors == 0 ? "COMPLETED" : "COMPLETED_WITH_ERRORS");
            task.setCompletedAt(LocalDateTime.now());
            importTaskRepository.save(task);

        } catch (Exception e) {
            logger.error("Lỗi khi nhập dữ liệu excel bất đồng bộ cho tiến trình {}", taskId, e);
            task.setStatus("FAILED");
            task.setErrorDetails(e.getMessage());
            task.setCompletedAt(LocalDateTime.now());
            importTaskRepository.save(task);
        }
    }

    private Gender parseGender(String str) {
        if (str == null || str.trim().isEmpty()) return Gender.MALE;
        String val = str.trim().toUpperCase();
        if (val.contains("NỮ") || val.contains("FEMALE") || val.equals("F")) {
            return Gender.FEMALE;
        }
        if (val.contains("KHÁC") || val.contains("OTHER")) {
            return Gender.OTHER;
        }
        return Gender.MALE;
    }
}
