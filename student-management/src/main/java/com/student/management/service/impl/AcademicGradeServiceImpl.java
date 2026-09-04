// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.AcademicGradeRequestDto;
import com.student.management.dto.req.AcademicGradeUpdateDto;
import com.student.management.dto.resp.AcademicGradeResponseDto;
import com.student.management.dto.resp.TranscriptResponseDto;
import com.student.management.entity.AcademicGrade;
import com.student.management.entity.Student;
import com.student.management.entity.Subject;
import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.AcademicGradeMapper;
import com.student.management.repository.AcademicGradeRepository;
import com.student.management.repository.StudentRepository;
import com.student.management.repository.SubjectRepository;
import com.student.management.service.AcademicGradeService;
import com.student.management.util.GradeCalculationUtils;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AcademicGradeServiceImpl implements AcademicGradeService {

    private static final Logger logger = LoggerFactory.getLogger(AcademicGradeServiceImpl.class);

    private final AcademicGradeRepository academicGradeRepository;
    private final StudentRepository studentRepository;
    private final SubjectRepository subjectRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AcademicGradeResponseDto> getAll(Pageable pageable) {
        return academicGradeRepository.findAll(pageable).map(AcademicGradeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicGradeResponseDto getById(Integer gradeId) {
        AcademicGrade grade = academicGradeRepository.findById(gradeId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy Grade: " + gradeId));
        return AcademicGradeMapper.toDto(grade);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AcademicGradeResponseDto> searchAndFilter(
            String studentId, String subjectId, Semester semester, String academicYear, StudyPhase studyPhase, Pageable pageable) {
        return academicGradeRepository.searchAndFilter(studentId, subjectId, semester, academicYear, studyPhase, pageable)
                .map(AcademicGradeMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicGradeResponseDto> getByStudentId(String studentId) {
        return AcademicGradeMapper.toDtoList(academicGradeRepository.findByStudentId(studentId));
    }

    @Override
    @Transactional(readOnly = true)
    public TranscriptResponseDto getTranscriptByStudentId(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sinh viên ID: " + studentId));
        List<AcademicGrade> allGrades = academicGradeRepository.findByStudentId(studentId);
        return GradeCalculationUtils.buildTranscript(student, allGrades);
    }

    @Override
    @Transactional
    public AcademicGradeResponseDto create(AcademicGradeRequestDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sinh viên: " + dto.getStudentId()));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy môn học: " + dto.getSubjectId()));

        if (academicGradeRepository.findExistingGrade(dto.getStudentId(), dto.getSubjectId(), dto.getSemester(), dto.getAcademicYear(), dto.getStudyPhase()).isPresent()) {
            throw new IllegalArgumentException("Điểm số đã tồn tại cho môn học, học kỳ, niên khóa và giai đoạn này.");
        }

        // Nếu scoreScale10 chưa truyền nhưng có đủ 3 điểm thành phần thì tự động tính toán
        if (dto.getScoreScale10() == null && dto.getAttendanceScore() != null && dto.getMidtermScore() != null && dto.getFinalExamScore() != null) {
            BigDecimal wAtt = subject.getAttendanceWeight() != null ? subject.getAttendanceWeight() : new BigDecimal("0.10");
            BigDecimal wMid = subject.getMidtermWeight() != null ? subject.getMidtermWeight() : new BigDecimal("0.30");
            BigDecimal wFin = subject.getFinalExamWeight() != null ? subject.getFinalExamWeight() : new BigDecimal("0.60");
            BigDecimal calculated10 = dto.getAttendanceScore().multiply(wAtt)
                    .add(dto.getMidtermScore().multiply(wMid))
                    .add(dto.getFinalExamScore().multiply(wFin))
                    .setScale(1, java.math.RoundingMode.HALF_UP);
            dto.setScoreScale10(calculated10);
        }

        // Tự động quy đổi điểm chuẩn Thông tư 08/2021/TT-BGDĐT nếu chưa điền
        if (dto.getLetterGrade() == null || dto.getLetterGrade().isBlank()) {
            dto.setLetterGrade(GradeCalculationUtils.determineLetterGrade(dto.getScoreScale10()));
        }
        if (dto.getScoreScale4() == null) {
            dto.setScoreScale4(GradeCalculationUtils.determineScoreScale4(dto.getLetterGrade()));
        }

        AcademicGrade grade = AcademicGradeMapper.toEntity(dto, student, subject);
        return AcademicGradeMapper.toDto(academicGradeRepository.save(grade));
    }

    @Override
    @Transactional
    public AcademicGradeResponseDto update(Integer gradeId, AcademicGradeUpdateDto dto) {
        AcademicGrade grade = academicGradeRepository.findById(gradeId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy Grade: " + gradeId));

        grade.setSemester(dto.getSemester());
        grade.setStudyPhase(dto.getStudyPhase());

        if (dto.getAttendanceScore() != null) grade.setAttendanceScore(dto.getAttendanceScore());
        if (dto.getMidtermScore() != null) grade.setMidtermScore(dto.getMidtermScore());
        if (dto.getFinalExamScore() != null) grade.setFinalExamScore(dto.getFinalExamScore());

        if (dto.getScoreScale10() != null) {
            grade.setScoreScale10(dto.getScoreScale10());
        } else if (grade.getAttendanceScore() != null && grade.getMidtermScore() != null && grade.getFinalExamScore() != null && grade.getSubject() != null) {
            Subject subj = grade.getSubject();
            BigDecimal wAtt = subj.getAttendanceWeight() != null ? subj.getAttendanceWeight() : new BigDecimal("0.10");
            BigDecimal wMid = subj.getMidtermWeight() != null ? subj.getMidtermWeight() : new BigDecimal("0.30");
            BigDecimal wFin = subj.getFinalExamWeight() != null ? subj.getFinalExamWeight() : new BigDecimal("0.60");
            BigDecimal calculated10 = grade.getAttendanceScore().multiply(wAtt)
                    .add(grade.getMidtermScore().multiply(wMid))
                    .add(grade.getFinalExamScore().multiply(wFin))
                    .setScale(1, java.math.RoundingMode.HALF_UP);
            grade.setScoreScale10(calculated10);
        }

        String letterGrade = (dto.getLetterGrade() != null && !dto.getLetterGrade().isBlank())
                ? dto.getLetterGrade()
                : GradeCalculationUtils.determineLetterGrade(grade.getScoreScale10());
        BigDecimal scoreScale4 = dto.getScoreScale4() != null
                ? dto.getScoreScale4()
                : GradeCalculationUtils.determineScoreScale4(letterGrade);

        grade.setLetterGrade(letterGrade);
        grade.setScoreScale4(scoreScale4);

        return AcademicGradeMapper.toDto(academicGradeRepository.save(grade));
    }

    @Override
    @Transactional
    public List<AcademicGradeResponseDto> saveBatch(List<AcademicGradeRequestDto> dtos) {
        List<AcademicGradeResponseDto> results = new ArrayList<>();
        if (dtos == null || dtos.isEmpty()) return results;

        for (AcademicGradeRequestDto dto : dtos) {
            if (dto.getGradeId() != null) {
                AcademicGradeUpdateDto updateDto = AcademicGradeUpdateDto.builder()
                        .semester(dto.getSemester())
                        .studyPhase(dto.getStudyPhase())
                        .attendanceScore(dto.getAttendanceScore())
                        .midtermScore(dto.getMidtermScore())
                        .finalExamScore(dto.getFinalExamScore())
                        .scoreScale10(dto.getScoreScale10())
                        .scoreScale4(dto.getScoreScale4())
                        .letterGrade(dto.getLetterGrade())
                        .build();
                results.add(update(dto.getGradeId(), updateDto));
            } else {
                var existing = academicGradeRepository.findExistingGrade(
                        dto.getStudentId(), dto.getSubjectId(), dto.getSemester(), dto.getAcademicYear(), dto.getStudyPhase()
                );
                if (existing.isPresent()) {
                    AcademicGradeUpdateDto updateDto = AcademicGradeUpdateDto.builder()
                            .semester(dto.getSemester())
                            .studyPhase(dto.getStudyPhase())
                            .attendanceScore(dto.getAttendanceScore())
                            .midtermScore(dto.getMidtermScore())
                            .finalExamScore(dto.getFinalExamScore())
                            .scoreScale10(dto.getScoreScale10())
                            .scoreScale4(dto.getScoreScale4())
                            .letterGrade(dto.getLetterGrade())
                            .build();
                    results.add(update(existing.get().getGradeId(), updateDto));
                } else {
                    results.add(create(dto));
                }
            }
        }
        return results;
    }

    @Override
    @Transactional
    public void delete(Integer gradeId) {
        if (!academicGradeRepository.existsById(gradeId)) {
            throw new NotFoundException("Không tìm thấy Grade: " + gradeId);
        }
        academicGradeRepository.deleteById(gradeId);
    }

    @Override
    @Transactional
    public List<AcademicGradeResponseDto> importFromExcel(MultipartFile file) {
        List<AcademicGradeResponseDto> list = new ArrayList<>();
        try (Workbook workbook = com.student.management.util.ExcelValidationUtils.validateAndOpenWorkbook(file)) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            if (sheet.getLastRowNum() < 1) return list;

            Row headerRow = sheet.getRow(0);
            Map<String, Integer> colIndex = new HashMap<>();
            if (headerRow != null) {
                for (int c = 0; c < headerRow.getLastCellNum(); c++) {
                    String col = formatter.formatCellValue(headerRow.getCell(c)).trim().toLowerCase();
                    colIndex.put(col, c);
                }
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String studentId = getCellValue(row, formatter, colIndex, "mã sinh viên", 0);
                String subjectId = getCellValue(row, formatter, colIndex, "mã môn học", 2);
                if (subjectId.isEmpty()) {
                    subjectId = getCellValue(row, formatter, colIndex, "mã môn", 1);
                }
                if (studentId.isEmpty() || subjectId.isEmpty()) continue;

                String semesterStr = getCellValue(row, formatter, colIndex, "học kỳ", 4);
                String academicYear = getCellValue(row, formatter, colIndex, "academic year", 5);
                if (academicYear.isEmpty()) {
                    academicYear = getCellValue(row, formatter, colIndex, "năm học", 5);
                }
                if (academicYear.isEmpty()) {
                    academicYear = "2026-2027";
                }

                BigDecimal score10 = parseScore(getCellValue(row, formatter, colIndex, "điểm hệ 10", 6));
                BigDecimal score4 = parseScore(getCellValue(row, formatter, colIndex, "điểm hệ 4", 7));
                String letterGrade = getCellValue(row, formatter, colIndex, "điểm chữ", 8);

                BigDecimal attScore = parseScore(getCellValue(row, formatter, colIndex, "chuyên cần", -1));
                BigDecimal midScore = parseScore(getCellValue(row, formatter, colIndex, "giữa kỳ", -1));
                BigDecimal finScore = parseScore(getCellValue(row, formatter, colIndex, "cuối kỳ", -1));

                AcademicGradeRequestDto dto = new AcademicGradeRequestDto();
                dto.setStudentId(studentId);
                dto.setSubjectId(subjectId);
                dto.setSemester(parseSemester(semesterStr));
                dto.setAcademicYear(academicYear);
                dto.setStudyPhase(StudyPhase.PHASE_1);
                dto.setAttendanceScore(attScore);
                dto.setMidtermScore(midScore);
                dto.setFinalExamScore(finScore);
                dto.setScoreScale10(score10);
                dto.setScoreScale4(score4);
                dto.setLetterGrade(letterGrade.isEmpty() ? null : letterGrade);

                try {
                    list.add(create(dto));
                } catch (Exception e) {
                    logger.warn("Không thể lưu điểm tại dòng {}: {}", i, e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error("Lỗi khi nhập grade từ file Excel: ", e);
            throw new RuntimeException("Lỗi khi nhập grade từ file Excel: " + e.getMessage());
        }
        return list;
    }

    private String getCellValue(Row row, DataFormatter formatter, Map<String, Integer> colIndex, String headerKey, int defaultCol) {
        for (Map.Entry<String, Integer> entry : colIndex.entrySet()) {
            if (entry.getKey().contains(headerKey)) {
                return formatter.formatCellValue(row.getCell(entry.getValue())).trim();
            }
        }
        if (defaultCol >= 0 && defaultCol < row.getLastCellNum()) {
            return formatter.formatCellValue(row.getCell(defaultCol)).trim();
        }
        return "";
    }

    private BigDecimal parseScore(String value) {
        if (value == null || value.trim().isEmpty()) return null;
        try {
            return new BigDecimal(value.trim().replace(',', '.'));
        } catch (Exception e) {
            return null;
        }
    }

    private Semester parseSemester(String value) {
        if (value == null || value.trim().isEmpty()) return Semester.SEMESTER_1;
        String v = value.trim().toUpperCase();
        if (v.contains("2") || v.contains("SEMESTER_2")) return Semester.SEMESTER_2;
        if (v.contains("HÈ") || v.contains("HE") || v.contains("SUMMER")) return Semester.SUMMER_SEMESTER;
        return Semester.SEMESTER_1;
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<AcademicGradeResponseDto> grades) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Điểm");
            Row header = sheet.createRow(0);
            String[] cols = {"Mã sinh viên", "Student Name", "Mã môn học", "Tên môn học", "Học kỳ", "Academic Year", "Điểm hệ 10", "Điểm hệ 4", "Điểm chữ"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }
            int idx = 1;
            for (AcademicGradeResponseDto g : grades) {
                Row r = sheet.createRow(idx++);
                r.createCell(0).setCellValue(g.getStudentId() != null ? g.getStudentId() : "");
                r.createCell(1).setCellValue(g.getStudentName() != null ? g.getStudentName() : "");
                r.createCell(2).setCellValue(g.getSubjectId() != null ? g.getSubjectId() : "");
                r.createCell(3).setCellValue(g.getSubjectName() != null ? g.getSubjectName() : "");
                r.createCell(4).setCellValue(g.getSemester() != null ? g.getSemester().getDisplayName() : "");
                r.createCell(5).setCellValue(g.getAcademicYear() != null ? g.getAcademicYear() : "");
                r.createCell(6).setCellValue(g.getScoreScale10() != null ? g.getScoreScale10().doubleValue() : 0);
                r.createCell(7).setCellValue(g.getScoreScale4() != null ? g.getScoreScale4().doubleValue() : 0);
                r.createCell(8).setCellValue(g.getLetterGrade() != null ? g.getLetterGrade() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Lỗi khi xuất danh sách grade ra file Excel: ", e);
            throw new RuntimeException("Lỗi khi xuất danh sách grade ra file Excel: " + e.getMessage());
        }
    }
}
