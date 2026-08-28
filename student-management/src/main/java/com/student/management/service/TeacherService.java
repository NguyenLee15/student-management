// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.TeacherRequestDto;
import com.student.management.dto.resp.TeacherResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface TeacherService {
    Page<TeacherResponseDto> getAll(Pageable pageable);
    Page<TeacherResponseDto> searchAndFilter(String keyword, String facultyId, Pageable pageable);
    List<TeacherResponseDto> getAll();
    TeacherResponseDto getById(String teacherId);
    TeacherResponseDto create(TeacherRequestDto dto);
    TeacherResponseDto update(String teacherId, TeacherRequestDto dto);
    void delete(String teacherId);
    List<TeacherResponseDto> importFromExcel(MultipartFile file);
    ByteArrayInputStream exportToExcel(List<TeacherResponseDto> teachers);
}

