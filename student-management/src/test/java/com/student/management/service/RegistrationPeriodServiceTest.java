// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.RegistrationPeriodRequestDto;
import com.student.management.dto.resp.RegistrationPeriodResponseDto;
import com.student.management.entity.AcademicYear;
import com.student.management.entity.RegistrationPeriod;
import com.student.management.entity.Semester;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.RegistrationPeriodRepository;
import com.student.management.repository.SemesterRepository;
import com.student.management.service.impl.RegistrationPeriodServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationPeriodServiceTest {

    @Mock
    private RegistrationPeriodRepository registrationPeriodRepository;

    @Mock
    private SemesterRepository semesterRepository;

    @InjectMocks
    private RegistrationPeriodServiceImpl registrationPeriodService;

    private Semester sampleSemester;
    private RegistrationPeriod samplePeriod;

    @BeforeEach
    void setUp() {
        AcademicYear year = AcademicYear.builder()
                .academicYearId("2026-2027")
                .academicYearName("Năm học 2026-2027")
                .build();

        sampleSemester = Semester.builder()
                .id(1L)
                .name("Học kỳ 1 2026-2027")
                .semesterCode("20261")
                .academicYear(year)
                .startDate(LocalDate.of(2026, 9, 1))
                .endDate(LocalDate.of(2027, 1, 15))
                .active(true)
                .build();

        samplePeriod = RegistrationPeriod.builder()
                .id(10L)
                .name("Đợt 1 - Đăng ký tín chỉ chính thức")
                .semester(sampleSemester)
                .startTime(LocalDateTime.now().minusDays(1))
                .endTime(LocalDateTime.now().plusDays(5))
                .maxCreditsAllowed(24)
                .active(true)
                .build();
    }

    @Test
    @DisplayName("Lấy đợt đăng ký đang mở: Trả về đợt active thành công")
    void testGetActivePeriodSuccess() {
        when(registrationPeriodRepository.findActivePeriodsAt(any(LocalDateTime.class)))
                .thenReturn(List.of(samplePeriod));

        RegistrationPeriod activePeriod = registrationPeriodService.getActivePeriodForRegistration();
        assertNotNull(activePeriod);
        assertEquals(10L, activePeriod.getId());
        assertEquals("Đợt 1 - Đăng ký tín chỉ chính thức", activePeriod.getName());
    }

    @Test
    @DisplayName("Vi phạm: Không có đợt đăng ký nào mở phải ném REGISTRATION_PERIOD_CLOSED")
    void testGetActivePeriodWhenClosed() {
        when(registrationPeriodRepository.findActivePeriodsAt(any(LocalDateTime.class)))
                .thenReturn(List.of());

        BusinessException ex = assertThrows(BusinessException.class, () -> 
                registrationPeriodService.getActivePeriodForRegistration());
        assertEquals(ErrorCode.REGISTRATION_PERIOD_CLOSED, ex.getErrorCode());
    }

    @Test
    @DisplayName("Tạo đợt đăng ký hợp lệ: Lưu thành công")
    void testCreateRegistrationPeriodSuccess() {
        RegistrationPeriodRequestDto requestDto = RegistrationPeriodRequestDto.builder()
                .name("Đợt đăng ký bổ sung")
                .semesterId(1L)
                .startTime(LocalDateTime.now().plusDays(1))
                .endTime(LocalDateTime.now().plusDays(3))
                .maxCreditsAllowed(20)
                .active(true)
                .build();

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(sampleSemester));
        when(registrationPeriodRepository.save(any(RegistrationPeriod.class))).thenAnswer(i -> {
            RegistrationPeriod p = i.getArgument(0);
            p.setId(11L);
            return p;
        });

        RegistrationPeriodResponseDto response = registrationPeriodService.createRegistrationPeriod(requestDto);
        assertNotNull(response);
        assertEquals(11L, response.getId());
        assertEquals("Đợt đăng ký bổ sung", response.getName());
        assertEquals(20, response.getMaxCreditsAllowed());
    }

    @Test
    @DisplayName("Vi phạm: Thời gian kết thúc trước thời gian bắt đầu phải ném VALIDATION_ERROR")
    void testCreateRegistrationPeriodInvalidTimeRange() {
        RegistrationPeriodRequestDto requestDto = RegistrationPeriodRequestDto.builder()
                .name("Đợt sai thời gian")
                .semesterId(1L)
                .startTime(LocalDateTime.now().plusDays(5))
                .endTime(LocalDateTime.now().plusDays(2)) // Kết thúc trước bắt đầu!
                .maxCreditsAllowed(20)
                .build();

        BusinessException ex = assertThrows(BusinessException.class, () ->
                registrationPeriodService.createRegistrationPeriod(requestDto));
        assertEquals(ErrorCode.VALIDATION_ERROR, ex.getErrorCode());
    }
}

