package com.student.management.service;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.CreditClassResponseDto;

import java.util.List;

public interface CreditClassService {
    List<CreditClassResponseDto> getAll();
    CreditClassResponseDto getById(Long creditClassId);
    CreditClassResponseDto create(CreditClassRequestDto dto);
    CreditClassResponseDto update(Long creditClassId, CreditClassRequestDto dto);
    void delete(Long creditClassId);
    void addStudentToCreditClass(Long creditClassId, String studentId);
    void removeStudentFromCreditClass(Long creditClassId, String studentId);
}

