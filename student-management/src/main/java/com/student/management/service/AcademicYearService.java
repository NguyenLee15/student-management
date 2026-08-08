package com.student.management.service;

import com.student.management.dto.req.AcademicYearRequestDto;
import com.student.management.dto.resp.AcademicYearResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AcademicYearService {
    Page<AcademicYearResponseDto> getAll(Pageable pageable);
    List<AcademicYearResponseDto> getAll();
    AcademicYearResponseDto getById(String academicYearId);
    AcademicYearResponseDto create(AcademicYearRequestDto dto);
    AcademicYearResponseDto update(String academicYearId, AcademicYearRequestDto dto);
    void delete(String academicYearId);
}

