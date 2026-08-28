package com.student.management.service;

import com.student.management.dto.req.CartValidationRequestDto;
import com.student.management.dto.resp.CartValidationResponseDto;
import com.student.management.dto.resp.RegistrationPeriodResponseDto;
import com.student.management.entity.*;
import com.student.management.enums.ClassShift;
import com.student.management.repository.*;
import com.student.management.service.impl.CourseRegistrationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import com.student.management.exception.ErrorCode;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseRegistrationValidationTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private CreditClassRepository creditClassRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private AcademicGradeRepository academicGradeRepository;

    @Mock
    private SemesterScheduleRepository semesterScheduleRepository;

    @Mock
    private RegistrationPeriodService registrationPeriodService;

    @Mock
    private TuitionPolicyService tuitionPolicyService;

    @Mock
    private TuitionService tuitionService;

    @InjectMocks
    private CourseRegistrationServiceImpl courseRegistrationService;

    private Student sampleStudent;
    private RegistrationPeriodResponseDto sampleActivePeriod;
    private CreditClass class1;
    private CreditClass class2;
    private Subject sub1;
    private Subject sub2;

    @BeforeEach
    void setUp() {
        sampleStudent = Student.builder()
                .studentId("SV001")
                .fullName("Nguyễn Văn A")
                .build();

        sampleActivePeriod = RegistrationPeriodResponseDto.builder()
                .id(1L)
                .semesterId(1L)
                .maxCreditsAllowed(24)
                .isCurrentlyOpen(true)
                .build();

        sub1 = Subject.builder()
                .subjectId("JAVA01")
                .subjectName("Lập trình Java")
                .credits(3)
                .build();

        sub2 = Subject.builder()
                .subjectId("DSA02")
                .subjectName("Cấu trúc dữ liệu")
                .credits(4)
                .prerequisiteSubject(sub1) // Yêu cầu JAVA01
                .build();

        class1 = CreditClass.builder()
                .creditClassId(101L)
                .creditClassName("Lớp Java 01")
                .subject(sub1)
                .maxStudents(40)
                .enrolledCount(10)
                .build();

        class2 = CreditClass.builder()
                .creditClassId(102L)
                .creditClassName("Lớp DSA 01")
                .subject(sub2)
                .maxStudents(40)
                .enrolledCount(10)
                .build();
    }

    @Test
    @DisplayName("Vi phạm đợt đóng: Trả về lỗi REGISTRATION_PERIOD_CLOSED")
    void testValidateCartWhenPeriodClosed() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(sampleStudent));
        when(registrationPeriodService.getCurrentlyActivePeriods()).thenReturn(List.of());

        CartValidationRequestDto req = CartValidationRequestDto.builder()
                .creditClassIds(List.of(101L))
                .build();

        CartValidationResponseDto result = courseRegistrationService.validateCart("SV001", req);
        assertFalse(result.isValid());
        assertEquals(1, result.getViolations().size());
        assertEquals(ErrorCode.REGISTRATION_PERIOD_CLOSED, result.getViolations().get(0).getErrorCode());
    }

    @Test
    @DisplayName("Vi phạm tiên quyết: Chưa học JAVA01 mà đăng ký DSA02 phải báo REGISTRATION_PREREQUISITE_FAILED")
    void testValidateCartPrerequisiteFailed() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(sampleStudent));
        when(registrationPeriodService.getCurrentlyActivePeriods()).thenReturn(List.of(sampleActivePeriod));
        when(creditClassRepository.findAllById(List.of(102L))).thenReturn(List.of(class2));
        when(enrollmentRepository.sumActiveCreditsByStudentAndSemester("SV001", 1L)).thenReturn(0);
        when(academicGradeRepository.findByStudentIdAndSubjectId("SV001", "JAVA01")).thenReturn(List.of());
        when(tuitionPolicyService.getEffectiveUnitPrice(any(), any(), any())).thenReturn(new BigDecimal("450000.00"));

        CartValidationRequestDto req = CartValidationRequestDto.builder()
                .creditClassIds(List.of(102L))
                .build();

        CartValidationResponseDto result = courseRegistrationService.validateCart("SV001", req);
        assertFalse(result.isValid());
        assertTrue(result.getViolations().stream().anyMatch(v -> v.getErrorCode() == ErrorCode.REGISTRATION_PREREQUISITE_FAILED));
    }

    @Test
    @DisplayName("Vi phạm vượt trần tín chỉ: Đã đăng ký 22 tín chỉ + giỏ 4 tín chỉ = 26 > 24")
    void testValidateCartCreditLimitExceeded() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(sampleStudent));
        when(registrationPeriodService.getCurrentlyActivePeriods()).thenReturn(List.of(sampleActivePeriod));
        when(creditClassRepository.findAllById(List.of(102L))).thenReturn(List.of(class2));
        when(enrollmentRepository.sumActiveCreditsByStudentAndSemester("SV001", 1L)).thenReturn(22);
        when(academicGradeRepository.findByStudentIdAndSubjectId("SV001", "JAVA01")).thenReturn(List.of(
                AcademicGrade.builder().scoreScale10(new BigDecimal("8.0")).build()
        ));
        when(tuitionPolicyService.getEffectiveUnitPrice(any(), any(), any())).thenReturn(new BigDecimal("450000.00"));

        CartValidationRequestDto req = CartValidationRequestDto.builder()
                .creditClassIds(List.of(102L))
                .build();

        CartValidationResponseDto result = courseRegistrationService.validateCart("SV001", req);
        assertFalse(result.isValid());
        assertTrue(result.getViolations().stream().anyMatch(v -> v.getErrorCode() == ErrorCode.REGISTRATION_CREDIT_LIMIT_EXCEEDED));
    }

    @Test
    @DisplayName("Vi phạm lớp đầy sĩ số: enrolledCount = 40 / maxStudents = 40")
    void testValidateCartClassFull() {
        class1.setEnrolledCount(40);
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(sampleStudent));
        when(registrationPeriodService.getCurrentlyActivePeriods()).thenReturn(List.of(sampleActivePeriod));
        when(creditClassRepository.findAllById(List.of(101L))).thenReturn(List.of(class1));
        when(enrollmentRepository.sumActiveCreditsByStudentAndSemester("SV001", 1L)).thenReturn(0);
        when(tuitionPolicyService.getEffectiveUnitPrice(any(), any(), any())).thenReturn(new BigDecimal("450000.00"));

        CartValidationRequestDto req = CartValidationRequestDto.builder()
                .creditClassIds(List.of(101L))
                .build();

        CartValidationResponseDto result = courseRegistrationService.validateCart("SV001", req);
        assertFalse(result.isValid());
        assertTrue(result.getViolations().stream().anyMatch(v -> v.getErrorCode() == ErrorCode.REGISTRATION_CLASS_FULL));
    }

    @Test
    @DisplayName("Giỏ hợp lệ: Đạt tiên quyết, đủ chỗ, không trùng lịch -> valid = true, 0 violations")
    void testValidateCartSuccess() {
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(sampleStudent));
        when(registrationPeriodService.getCurrentlyActivePeriods()).thenReturn(List.of(sampleActivePeriod));
        when(creditClassRepository.findAllById(List.of(101L))).thenReturn(List.of(class1));
        when(enrollmentRepository.sumActiveCreditsByStudentAndSemester("SV001", 1L)).thenReturn(0);
        when(enrollmentRepository.findActiveEnrollmentsByStudentAndSemester("SV001", 1L)).thenReturn(List.of());
        when(semesterScheduleRepository.findByCreditClass_CreditClassIdIn(List.of(101L))).thenReturn(List.of(
                SemesterSchedule.builder().creditClass(class1).studyTime("Thứ 2, Tiết 1-3").classShift(ClassShift.MORNING).build()
        ));
        when(tuitionPolicyService.getEffectiveUnitPrice(any(), any(), any())).thenReturn(new BigDecimal("450000.00"));

        CartValidationRequestDto req = CartValidationRequestDto.builder()
                .creditClassIds(List.of(101L))
                .build();

        CartValidationResponseDto result = courseRegistrationService.validateCart("SV001", req);
        assertTrue(result.isValid());
        assertEquals(0, result.getViolations().size());
        assertEquals(3, result.getTotalSelectedCredits());
        assertEquals(new BigDecimal("1350000.00"), result.getEstimatedTotalTuition());
    }
}
