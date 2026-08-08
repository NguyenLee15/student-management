package com.student.management.service;

import com.student.management.dto.req.StudentClassRequestDto;
import com.student.management.dto.resp.StudentClassResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface StudentClassService {
    Page<StudentClassResponseDto> getAll(Pageable pageable);
    List<StudentClassResponseDto> getAll();
    Page<StudentClassResponseDto> getByFacultyId(String facultyId, Pageable pageable);
    StudentClassResponseDto getById(String classId);
    StudentClassResponseDto create(StudentClassRequestDto dto);
    StudentClassResponseDto update(String classId, StudentClassRequestDto dto);
    void delete(String classId);
    boolean existsById(String classId);
    ByteArrayInputStream exportToExcel(List<StudentClassResponseDto> classes);
}

