package com.student.management.service.impl;

import com.student.management.dto.req.TeacherRequestDto;
import com.student.management.dto.resp.TeacherResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.Teacher;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.TeacherMapper;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.TeacherRepository;
import com.student.management.service.TeacherService;
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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {

    private static final Logger logger = LoggerFactory.getLogger(TeacherServiceImpl.class);

    private final TeacherRepository teacherRepository;
    private final FacultyRepository facultyRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<TeacherResponseDto> getAll(Pageable pageable) {
        return teacherRepository.findAll(pageable).map(TeacherMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TeacherResponseDto> searchAndFilter(String keyword, String facultyId, Pageable pageable) {
        return teacherRepository.searchAndFilter(keyword, facultyId, pageable).map(TeacherMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TeacherResponseDto> getAll() {
        return TeacherMapper.toDtoList(teacherRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public TeacherResponseDto getById(String teacherId) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new NotFoundException("Teacher not found: " + teacherId));
        return TeacherMapper.toDto(teacher);
    }

    @Override
    @Transactional
    public TeacherResponseDto create(TeacherRequestDto dto) {
        if (teacherRepository.existsById(dto.getTeacherId())) {
            throw new IllegalArgumentException("Teacher ID already exists: " + dto.getTeacherId());
        }
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Faculty not found: " + dto.getFacultyId()));
        Teacher teacher = TeacherMapper.toEntity(dto, faculty);
        return TeacherMapper.toDto(teacherRepository.save(teacher));
    }

    @Override
    @Transactional
    public TeacherResponseDto update(String teacherId, TeacherRequestDto dto) {
        Teacher teacher = teacherRepository.findById(teacherId)
                .orElseThrow(() -> new NotFoundException("Teacher not found: " + teacherId));
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Faculty not found: " + dto.getFacultyId()));
        teacher.setFullName(dto.getFullName());
        teacher.setEmail(dto.getEmail());
        teacher.setFaculty(faculty);
        return TeacherMapper.toDto(teacherRepository.save(teacher));
    }

    @Override
    @Transactional
    public void delete(String teacherId) {
        if (!teacherRepository.existsById(teacherId)) {
            throw new NotFoundException("Teacher not found: " + teacherId);
        }
        teacherRepository.deleteById(teacherId);
    }

    @Override
    @Transactional
    public List<TeacherResponseDto> importFromExcel(MultipartFile file) {
        List<TeacherResponseDto> list = new ArrayList<>();
        try (Workbook workbook = com.student.management.util.ExcelValidationUtils.validateAndOpenWorkbook(file)) {
            Sheet sheet = workbook.getSheetAt(0);
            DataFormatter formatter = new DataFormatter();
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                String teacherId = formatter.formatCellValue(row.getCell(0)).trim();
                if (teacherId.isEmpty()) continue;
                String fullName = formatter.formatCellValue(row.getCell(1)).trim();
                String email = formatter.formatCellValue(row.getCell(2)).trim();
                String facultyId = formatter.formatCellValue(row.getCell(3)).trim();
                if (facultyId.isEmpty()) {
                    facultyId = facultyRepository.findAll().stream().findFirst().map(Faculty::getFacultyId).orElse(null);
                }
                if (facultyId != null) {
                    TeacherRequestDto dto = TeacherRequestDto.builder()
                            .teacherId(teacherId)
                            .fullName(fullName)
                            .email(email)
                            .facultyId(facultyId)
                            .build();
                    if (teacherRepository.existsById(teacherId)) {
                        list.add(update(teacherId, dto));
                    } else {
                        list.add(create(dto));
                    }
                }
            }
        } catch (Exception e) {
            logger.error("Error importing teacher excel: ", e);
            throw new RuntimeException("Error importing teacher excel: " + e.getMessage());
        }
        return list;
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<TeacherResponseDto> teachers) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Teachers");
            Row header = sheet.createRow(0);
            String[] cols = {"Teacher ID", "Full Name", "Email", "Faculty"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }
            int idx = 1;
            for (TeacherResponseDto t : teachers) {
                Row r = sheet.createRow(idx++);
                r.createCell(0).setCellValue(t.getTeacherId() != null ? t.getTeacherId() : "");
                r.createCell(1).setCellValue(t.getFullName() != null ? t.getFullName() : "");
                r.createCell(2).setCellValue(t.getEmail() != null ? t.getEmail() : "");
                r.createCell(3).setCellValue(t.getFacultyName() != null ? t.getFacultyName() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Error exporting teacher excel: ", e);
            throw new RuntimeException("Error exporting teacher excel: " + e.getMessage());
        }
    }
}

