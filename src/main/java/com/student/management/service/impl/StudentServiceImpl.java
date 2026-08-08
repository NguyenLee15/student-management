package com.student.management.service.impl;

import com.student.management.dto.req.StudentRequestDto;
import com.student.management.dto.resp.StudentResponseDto;
import com.student.management.entity.AcademicYear;
import com.student.management.entity.Student;
import com.student.management.entity.StudentClass;
import com.student.management.enums.Gender;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.StudentMapper;
import com.student.management.repository.AcademicYearRepository;
import com.student.management.repository.StudentClassRepository;
import com.student.management.repository.StudentRepository;
import com.student.management.service.StudentService;
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
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentServiceImpl implements StudentService {

    private static final Logger logger = LoggerFactory.getLogger(StudentServiceImpl.class);

    private final StudentRepository studentRepository;
    private final StudentClassRepository studentClassRepository;
    private final AcademicYearRepository academicYearRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponseDto> getAll(Pageable pageable) {
        return studentRepository.findAll(pageable).map(StudentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentResponseDto> searchAndFilter(String keyword, String classId, String facultyId, String academicYearId, Pageable pageable) {
        return studentRepository.searchAndFilterStudents(keyword, classId, facultyId, academicYearId, pageable)
                .map(StudentMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getStudentsByClassId(String classId) {
        List<Student> students = studentRepository.findByClassId(classId);
        return StudentMapper.toDtoList(students);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getStudentsByCreditClassId(Long creditClassId) {
        List<Student> students = studentRepository.findByCreditClassId(creditClassId);
        return StudentMapper.toDtoList(students);
    }

    @Override
    @Transactional
    public StudentResponseDto create(StudentRequestDto dto) {
        if (studentRepository.existsById(dto.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists: " + dto.getStudentId());
        }
        StudentClass studentClass = studentClassRepository.findById(dto.getClassId())
                .orElseThrow(() -> new NotFoundException("Class not found: " + dto.getClassId()));
        AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new NotFoundException("Academic year not found: " + dto.getAcademicYearId()));
        Student student = StudentMapper.toEntity(dto, studentClass, academicYear);
        Student saved = studentRepository.save(student);
        return StudentMapper.toDto(saved);
    }

    @Override
    @Transactional
    public StudentResponseDto update(String studentId, StudentRequestDto dto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));
        StudentClass studentClass = studentClassRepository.findById(dto.getClassId())
                .orElseThrow(() -> new NotFoundException("Class not found: " + dto.getClassId()));
        AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new NotFoundException("Academic year not found: " + dto.getAcademicYearId()));
        
        student.setFullName(dto.getFullName());
        student.setDateOfBirth(dto.getDateOfBirth());
        student.setGender(dto.getGender());
        student.setStudentClass(studentClass);
        student.setAcademicYear(academicYear);
        student.setEmail(dto.getEmail());
        
        Student updated = studentRepository.save(student);
        return StudentMapper.toDto(updated);
    }

    @Override
    @Transactional
    public StudentResponseDto saveOrUpdate(StudentRequestDto dto) {
        if (dto.getStudentId() != null && studentRepository.existsById(dto.getStudentId())) {
            return update(dto.getStudentId(), dto);
        }
        return create(dto);
    }

    @Override
    @Transactional
    public void delete(String studentId) {
        if (!studentRepository.existsById(studentId)) {
            throw new NotFoundException("Student not found: " + studentId);
        }
        studentRepository.deleteById(studentId);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentResponseDto getById(String studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));
        return StudentMapper.toDto(student);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentResponseDto> getAllForExport() {
        return StudentMapper.toDtoList(studentRepository.findAll());
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<StudentResponseDto> students) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Students");
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Student ID", "Full Name", "Date of Birth", "Gender", "Email", "Class"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }
            int rowIdx = 1;
            for (StudentResponseDto s : students) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(s.getStudentId() != null ? s.getStudentId() : "");
                row.createCell(1).setCellValue(s.getFullName() != null ? s.getFullName() : "");
                row.createCell(2).setCellValue(s.getDateOfBirth() != null ? s.getDateOfBirth().toString() : "");
                row.createCell(3).setCellValue(s.getGender() != null ? s.getGender().name() : "");
                row.createCell(4).setCellValue(s.getEmail() != null ? s.getEmail() : "");
                row.createCell(5).setCellValue(s.getClassName() != null ? s.getClassName() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Error exporting excel: ", e);
            throw new RuntimeException("Error exporting excel: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public List<StudentResponseDto> importFromExcel(MultipartFile file) {
        List<StudentResponseDto> imported = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
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
                            try {
                                dto.setDateOfBirth(LocalDate.parse(dateStr));
                            } catch (Exception e) {
                                logger.warn("Failed to parse date at row {}: {}", i, dateStr);
                            }
                        }
                    }
                }

                String genderStr = formatter.formatCellValue(row.getCell(3)).trim();
                if (!genderStr.isEmpty()) {
                    try {
                        dto.setGender(Gender.valueOf(genderStr.toUpperCase()));
                    } catch (IllegalArgumentException e) {
                        logger.warn("Invalid gender at row {}: {}", i, genderStr);
                    }
                }

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
                    imported.add(saveOrUpdate(dto));
                }
            }
        } catch (Exception e) {
            logger.error("Error importing excel: ", e);
            throw new RuntimeException("Error importing excel: " + e.getMessage());
        }
        return imported;
    }
}

