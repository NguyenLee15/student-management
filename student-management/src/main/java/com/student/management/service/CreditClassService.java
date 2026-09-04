// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.CreditClassResponseDto;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.student.management.dto.resp.CreditClassGradebookResponseDto;

public interface CreditClassService {
    List<CreditClassResponseDto> getAll();
    List<CreditClassResponseDto> getByTeacherId(String teacherId);
    Page<CreditClassResponseDto> getAll(Pageable pageable);
    CreditClassResponseDto getById(Long creditClassId);
    CreditClassGradebookResponseDto getGradebook(Long creditClassId);
    CreditClassResponseDto create(CreditClassRequestDto dto);
    CreditClassResponseDto update(Long creditClassId, CreditClassRequestDto dto);
    void delete(Long creditClassId);
    void addStudentToCreditClass(Long creditClassId, String studentId);
    void removeStudentFromCreditClass(Long creditClassId, String studentId);
}

