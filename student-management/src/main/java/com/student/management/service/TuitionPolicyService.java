package com.student.management.service;

import com.student.management.dto.req.TuitionPolicyRequestDto;
import com.student.management.dto.resp.TuitionPolicyResponseDto;
import com.student.management.entity.CreditClass;
import com.student.management.entity.Student;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface TuitionPolicyService {
    List<TuitionPolicyResponseDto> getAllPolicies();
    List<TuitionPolicyResponseDto> getPoliciesBySemester(Long semesterId);
    TuitionPolicyResponseDto createPolicy(TuitionPolicyRequestDto requestDto);
    TuitionPolicyResponseDto updatePolicy(Long id, TuitionPolicyRequestDto requestDto);
    void toggleActive(Long id);
    void deletePolicy(Long id);

    /**
     * Quy tắc 3 tầng xác định đơn giá tín chỉ:
     * 1. Chính sách riêng theo Khoa của Sinh viên
     * 2. Chính sách chung toàn trường (faculty = null)
     * 3. Mặc định trên Subject
     */
    BigDecimal getEffectiveUnitPrice(Student student, CreditClass creditClass, LocalDate date);
}
