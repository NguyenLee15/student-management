package com.student.management.service;

import com.student.management.dto.req.StudentRequestDto;
import com.student.management.dto.resp.StudentResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface StudentService {
    Page<StudentResponseDto> getAll(Pageable pageable);
    Page<StudentResponseDto> searchAndFilter(String keyword, String classId, String facultyId, String academicYearId, Pageable pageable);
    StudentResponseDto create(StudentRequestDto dto);
    StudentResponseDto update(String studentId, StudentRequestDto dto);
    StudentResponseDto saveOrUpdate(StudentRequestDto dto);
    void delete(String studentId);
    StudentResponseDto getById(String studentId);
    List<StudentResponseDto> importFromExcel(MultipartFile file);
    ByteArrayInputStream exportToExcel(List<StudentResponseDto> students);
    List<StudentResponseDto> getAllForExport();
    List<StudentResponseDto> getStudentsByClassId(String classId);
    List<StudentResponseDto> getStudentsByCreditClassId(Long creditClassId);
}

