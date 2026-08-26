package com.student.management.service;

import com.student.management.dto.req.CartValidationRequestDto;
import com.student.management.dto.req.RegistrationBatchRequestDto;
import com.student.management.dto.resp.CartValidationResponseDto;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.dto.resp.EnrollmentResponseDto;
import com.student.management.dto.resp.RegistrationBatchResponseDto;

import java.util.List;

public interface CourseRegistrationService {
    CartValidationResponseDto validateCart(String studentId, CartValidationRequestDto requestDto);
    RegistrationBatchResponseDto registerBatch(String studentId, RegistrationBatchRequestDto requestDto);
    void dropCourse(String studentId, Long enrollmentId);
    List<EnrollmentResponseDto> getMyEnrollments(String studentId, Long semesterId);
    List<CreditClassResponseDto> getAvailableClassesForRegistration(String studentId, Long semesterId);
}
