package com.example.student.management.service;

import com.example.student.management.dto.req.StudentClassRequestDto;
import com.example.student.management.dto.resp.StudentClassResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface StudentClassService {
    Page<StudentClassResponseDto> getByFacultyId(String facultyId, Pageable pageable);
    Page<StudentClassResponseDto> getAll(Pageable pageable);
    List<StudentClassResponseDto> getAll();
    StudentClassResponseDto getById(String classId);
    StudentClassResponseDto create(StudentClassRequestDto dto);
    StudentClassResponseDto update(String classId, StudentClassRequestDto dto);
    void delete(String classId);
}
