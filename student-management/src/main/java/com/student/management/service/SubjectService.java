package com.student.management.service;

import com.student.management.dto.req.SubjectRequestDto;
import com.student.management.dto.resp.SubjectResponseDto;
import com.student.management.enums.SubjectType;
import org.springframework.data.domain.Page;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Optional;

public interface SubjectService {
    Page<SubjectResponseDto> getAll(int page, int size);
    List<SubjectResponseDto> getAll();
    Page<SubjectResponseDto> searchBySubjectType(SubjectType subjectType, int page, int size);
    Page<SubjectResponseDto> searchByFacultyId(String facultyId, int page, int size);
    List<SubjectResponseDto> getByFacultyId(String facultyId);
    Optional<SubjectResponseDto> getById(String subjectId);
    SubjectResponseDto create(SubjectRequestDto dto);
    SubjectResponseDto update(String subjectId, SubjectRequestDto dto);
    void delete(String subjectId);
    ByteArrayInputStream exportToExcel(Page<SubjectResponseDto> subjects);
}

