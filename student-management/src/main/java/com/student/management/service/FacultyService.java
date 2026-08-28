// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.FacultyRequestDto;
import com.student.management.dto.resp.FacultyResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FacultyService {
    Page<FacultyResponseDto> getAll(Pageable pageable);
    List<FacultyResponseDto> getAll();
    FacultyResponseDto getById(String facultyId);
    FacultyResponseDto create(FacultyRequestDto dto);
    FacultyResponseDto update(String facultyId, FacultyRequestDto dto);
    void delete(String facultyId);
}

