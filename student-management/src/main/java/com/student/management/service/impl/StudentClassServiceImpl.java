// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.StudentClassRequestDto;
import com.student.management.dto.resp.StudentClassResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.StudentClass;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.StudentClassMapper;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.StudentClassRepository;
import com.student.management.service.StudentClassService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentClassServiceImpl implements StudentClassService {

    private static final Logger logger = LoggerFactory.getLogger(StudentClassServiceImpl.class);

    private final StudentClassRepository studentClassRepository;
    private final FacultyRepository facultyRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<StudentClassResponseDto> getAll(Pageable pageable) {
        return studentClassRepository.findAll(pageable).map(StudentClassMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StudentClassResponseDto> getAll() {
        return StudentClassMapper.toDtoList(studentClassRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentClassResponseDto> getByFacultyId(String facultyId, Pageable pageable) {
        return studentClassRepository.findByFacultyId(facultyId, pageable).map(StudentClassMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentClassResponseDto getById(String classId) {
        StudentClass sc = studentClassRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp học: " + classId));
        return StudentClassMapper.toDto(sc);
    }

    @Override
    @Transactional
    public StudentClassResponseDto create(StudentClassRequestDto dto) {
        if (studentClassRepository.existsById(dto.getClassId())) {
            throw new IllegalArgumentException("Mã lớp đã tồn tại: " + dto.getClassId());
        }
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa: " + dto.getFacultyId()));
        StudentClass sc = StudentClassMapper.toEntity(dto, faculty);
        return StudentClassMapper.toDto(studentClassRepository.save(sc));
    }

    @Override
    @Transactional
    public StudentClassResponseDto update(String classId, StudentClassRequestDto dto) {
        StudentClass sc = studentClassRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp học: " + classId));
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa: " + dto.getFacultyId()));
        sc.setClassName(dto.getClassName());
        sc.setFaculty(faculty);
        return StudentClassMapper.toDto(studentClassRepository.save(sc));
    }

    @Override
    @Transactional
    public void delete(String classId) {
        if (!studentClassRepository.existsById(classId)) {
            throw new NotFoundException("Không tìm thấy lớp học: " + classId);
        }
        studentClassRepository.deleteById(classId);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean existsById(String classId) {
        return studentClassRepository.existsById(classId);
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<StudentClassResponseDto> classes) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Lớp học");
            Row header = sheet.createRow(0);
            String[] cols = {"Mã lớp", "Tên lớp", "Khoa"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }
            int idx = 1;
            for (StudentClassResponseDto c : classes) {
                Row r = sheet.createRow(idx++);
                r.createCell(0).setCellValue(c.getClassId() != null ? c.getClassId() : "");
                r.createCell(1).setCellValue(c.getClassName() != null ? c.getClassName() : "");
                r.createCell(2).setCellValue(c.getFacultyName() != null ? c.getFacultyName() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Lỗi khi xuất danh sách class ra file Excel: ", e);
            throw new RuntimeException("Lỗi khi xuất danh sách class ra file Excel: " + e.getMessage());
        }
    }
}

