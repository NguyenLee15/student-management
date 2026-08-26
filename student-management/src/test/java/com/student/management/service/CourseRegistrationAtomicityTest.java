package com.student.management.service;

import com.student.management.dto.req.RegistrationBatchRequestDto;
import com.student.management.dto.resp.RegistrationBatchResponseDto;
import com.student.management.dto.resp.RegistrationPeriodResponseDto;
import com.student.management.entity.*;
import com.student.management.enums.EnrollmentStatus;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
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
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseRegistrationAtomicityTest {

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
    private Semester sampleSemester;
    private RegistrationPeriod samplePeriod;
    private RegistrationPeriodResponseDto sampleActivePeriodDto;
    private CreditClass class1;
    private CreditClass class2;

    @BeforeEach
    void setUp() {
        sampleStudent = Student.builder()
                .studentId("SV001")
                .fullName("Nguyễn Văn A")
                .build();

        sampleSemester = Semester.builder()
                .id(1L)
                .name("Học kỳ 1 2026-2027")
                .semesterCode("20261")
                .build();

        samplePeriod = RegistrationPeriod.builder()
                .id(10L)
                .name("Đợt 1")
                .semester(sampleSemester)
                .maxCreditsAllowed(24)
                .active(true)
                .startTime(LocalDateTime.now().minusDays(1))
                .endTime(LocalDateTime.now().plusDays(10))
                .build();

        sampleActivePeriodDto = RegistrationPeriodResponseDto.builder()
                .id(10L)
                .semesterId(1L)
                .maxCreditsAllowed(24)
                .isCurrentlyOpen(true)
                .build();

        Subject sub1 = Subject.builder().subjectId("JAVA01").subjectName("Java").credits(3).build();
        Subject sub2 = Subject.builder().subjectId("DB03").subjectName("Database").credits(3).build();

        class1 = CreditClass.builder()
                .creditClassId(101L)
                .creditClassName("Lớp Java")
                .subject(sub1)
                .semester(sampleSemester)
                .maxStudents(40)
                .enrolledCount(10)
                .build();

        class2 = CreditClass.builder()
                .creditClassId(102L)
                .creditClassName("Lớp DB")
                .subject(sub2)
                .semester(sampleSemester)
                .maxStudents(40)
                .enrolledCount(15)
                .build();
    }

    @Test
    @DisplayName("Đăng ký thành công: Cả 2 lớp được lưu, sĩ số tăng, gọi TuitionService ghi nhận học phí")
    void testRegisterBatchSuccess() {
        when(studentRepository.findByIdForUpdate("SV001")).thenReturn(Optional.of(sampleStudent));
        when(studentRepository.findById("SV001")).thenReturn(Optional.of(sampleStudent));
        when(registrationPeriodService.getCurrentlyActivePeriods()).thenReturn(List.of(sampleActivePeriodDto));
        when(registrationPeriodService.getActivePeriodForRegistration()).thenReturn(samplePeriod);

        when(creditClassRepository.findAllById(List.of(101L, 102L))).thenReturn(List.of(class1, class2));
        when(creditClassRepository.findByIdForUpdate(101L)).thenReturn(Optional.of(class1));
        when(creditClassRepository.findByIdForUpdate(102L)).thenReturn(Optional.of(class2));
        when(creditClassRepository.save(any(CreditClass.class))).thenAnswer(i -> i.getArgument(0));

        when(enrollmentRepository.sumActiveCreditsByStudentAndSemester("SV001", 1L)).thenReturn(0);
        when(enrollmentRepository.findActiveEnrollmentsByStudentAndSemester("SV001", 1L)).thenReturn(List.of());
        when(enrollmentRepository.save(any(Enrollment.class))).thenAnswer(i -> {
            Enrollment e = i.getArgument(0);
            e.setId(999L);
            return e;
        });

        when(tuitionPolicyService.getEffectiveUnitPrice(any(), any(), any())).thenReturn(new BigDecimal("450000.00"));

        RegistrationBatchRequestDto requestDto = RegistrationBatchRequestDto.builder()
                .creditClassIds(List.of(101L, 102L))
                .idempotencyKey("KEY-123")
                .build();

        RegistrationBatchResponseDto response = courseRegistrationService.registerBatch("SV001", requestDto);

        assertTrue(response.isSuccess());
        assertEquals(2, response.getRegisteredClassCount());
        assertEquals(11, class1.getEnrolledCount()); // Tăng sĩ số
        assertEquals(16, class2.getEnrolledCount()); // Tăng sĩ số
        verify(tuitionService, times(2)).addCourseEnrollmentToInvoice(any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Rút môn trong đợt mở: Trạng thái chuyển DROPPED, giảm sĩ số lớp 1, hoàn học phí 100%")
    void testDropCourseDuringOpenRegistration() {
        Enrollment existingEnrollment = Enrollment.builder()
                .id(501L)
                .student(sampleStudent)
                .creditClass(class1)
                .semester(sampleSemester)
                .status(EnrollmentStatus.ENROLLED)
                .build();

        when(enrollmentRepository.findByIdForUpdate(501L)).thenReturn(Optional.of(existingEnrollment));
        when(creditClassRepository.findByIdForUpdate(101L)).thenReturn(Optional.of(class1));
        when(registrationPeriodService.getCurrentlyActivePeriods()).thenReturn(List.of(sampleActivePeriodDto));

        courseRegistrationService.dropCourse("SV001", 501L);

        assertEquals(EnrollmentStatus.DROPPED, existingEnrollment.getStatus());
        assertNotNull(existingEnrollment.getDropDate());
        assertEquals(9, class1.getEnrolledCount()); // Giảm từ 10 xuống 9
        verify(tuitionService, times(1)).cancelCourseFromInvoice(501L);
    }
}
