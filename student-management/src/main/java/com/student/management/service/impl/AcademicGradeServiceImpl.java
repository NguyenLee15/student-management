package com.student.management.service.impl;

import com.student.management.dto.req.AcademicGradeRequestDto;
import com.student.management.dto.req.AcademicGradeUpdateDto;
import com.student.management.dto.resp.AcademicGradeResponseDto;
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
import java.util.List;

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
                .orElseThrow(() -> new NotFoundException("Grade not found: " + gradeId));
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
    @Transactional
    public AcademicGradeResponseDto create(AcademicGradeRequestDto dto) {
        Student student = studentRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new NotFoundException("Student not found: " + dto.getStudentId()));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Subject not found: " + dto.getSubjectId()));

        if (academicGradeRepository.findExistingGrade(dto.getStudentId(), dto.getSubjectId(), dto.getSemester(), dto.getAcademicYear(), dto.getStudyPhase()).isPresent()) {
            throw new IllegalArgumentException("Grade already exists for this subject, semester, academic year, and phase.");
        }

        AcademicGrade grade = AcademicGradeMapper.toEntity(dto, student, subject);
        return AcademicGradeMapper.toDto(academicGradeRepository.save(grade));
    }

    @Override
    @Transactional
    public AcademicGradeResponseDto update(Integer gradeId, AcademicGradeUpdateDto dto) {
        AcademicGrade grade = academicGradeRepository.findById(gradeId)
                .orElseThrow(() -> new NotFoundException("Grade not found: " + gradeId));

        grade.setSemester(dto.getSemester());
        grade.setStudyPhase(dto.getStudyPhase());
        grade.setScoreScale10(dto.getScoreScale10());
        grade.setScoreScale4(dto.getScoreScale4());
        grade.setLetterGrade(dto.getLetterGrade());

        return AcademicGradeMapper.toDto(academicGradeRepository.save(grade));
    }

    @Override
    @Transactional
    public void delete(Integer gradeId) {
        if (!academicGradeRepository.existsById(gradeId)) {
            throw new NotFoundException("Grade not found: " + gradeId);
        }
        academicGradeRepository.deleteById(gradeId);
    }

    @Override
    @Transactional
    public List<AcademicGradeResponseDto> importFromExcel(MultipartFile file) {
        List<AcademicGradeResponseDto> list = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;

                String studentId = formatter.formatCellValue(row.getCell(0)).trim();
                String subjectId = formatter.formatCellValue(row.getCell(1)).trim();
                if (studentId.isEmpty() || subjectId.isEmpty()) continue;

                AcademicGradeRequestDto dto = new AcademicGradeRequestDto();
                dto.setStudentId(studentId);
                dto.setSubjectId(subjectId);
                dto.setSemester(Semester.SEMESTER_1);
                dto.setAcademicYear("2025-2026");
                dto.setStudyPhase(StudyPhase.PHASE_1);
                dto.setScoreScale10(new BigDecimal("8.0"));
                dto.setScoreScale4(new BigDecimal("3.2"));
                dto.setLetterGrade("B+");

                try {
                    list.add(create(dto));
                } catch (Exception e) {
                    logger.warn("Skipping row {}: {}", i, e.getMessage());
                }
            }
        } catch (Exception e) {
            logger.error("Error importing grade excel: ", e);
            throw new RuntimeException("Error importing grade excel: " + e.getMessage());
        }
        return list;
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<AcademicGradeResponseDto> grades) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Grades");
            Row header = sheet.createRow(0);
            String[] cols = {"Student ID", "Student Name", "Subject ID", "Subject Name", "Semester", "Academic Year", "Score 10", "Score 4", "Letter"};
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
            logger.error("Error exporting grade excel: ", e);
            throw new RuntimeException("Error exporting grade excel: " + e.getMessage());
        }
    }
}

