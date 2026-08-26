package com.student.management.service.impl;

import com.student.management.dto.req.RegistrationPeriodRequestDto;
import com.student.management.dto.resp.RegistrationPeriodResponseDto;
import com.student.management.entity.RegistrationPeriod;
import com.student.management.entity.Semester;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.RegistrationPeriodRepository;
import com.student.management.repository.SemesterRepository;
import com.student.management.service.RegistrationPeriodService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RegistrationPeriodServiceImpl implements RegistrationPeriodService {

    private final RegistrationPeriodRepository registrationPeriodRepository;
    private final SemesterRepository semesterRepository;

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationPeriodResponseDto> getAllRegistrationPeriods() {
        LocalDateTime now = LocalDateTime.now();
        return registrationPeriodRepository.findAll().stream()
                .map(period -> toDto(period, now))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationPeriodResponseDto getRegistrationPeriodById(Long id) {
        RegistrationPeriod period = registrationPeriodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy đợt đăng ký tín chỉ có ID: " + id));
        return toDto(period, LocalDateTime.now());
    }

    @Override
    @Transactional
    public RegistrationPeriodResponseDto createRegistrationPeriod(RegistrationPeriodRequestDto requestDto) {
        validateTimeRange(requestDto.getStartTime(), requestDto.getEndTime());

        Semester semester = semesterRepository.findById(requestDto.getSemesterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy học kỳ có ID: " + requestDto.getSemesterId()));

        RegistrationPeriod period = RegistrationPeriod.builder()
                .name(requestDto.getName())
                .semester(semester)
                .startTime(requestDto.getStartTime())
                .endTime(requestDto.getEndTime())
                .maxCreditsAllowed(requestDto.getMaxCreditsAllowed())
                .active(requestDto.getActive() != null ? requestDto.getActive() : true)
                .build();

        RegistrationPeriod saved = registrationPeriodRepository.save(period);
        log.info("REGISTRATION_PERIOD_CREATED id={} name='{}' semesterId={} start={} end={}",
                saved.getId(), saved.getName(), semester.getId(), saved.getStartTime(), saved.getEndTime());

        return toDto(saved, LocalDateTime.now());
    }

    @Override
    @Transactional
    public RegistrationPeriodResponseDto updateRegistrationPeriod(Long id, RegistrationPeriodRequestDto requestDto) {
        validateTimeRange(requestDto.getStartTime(), requestDto.getEndTime());

        RegistrationPeriod period = registrationPeriodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy đợt đăng ký tín chỉ có ID: " + id));

        Semester semester = semesterRepository.findById(requestDto.getSemesterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy học kỳ có ID: " + requestDto.getSemesterId()));

        period.setName(requestDto.getName());
        period.setSemester(semester);
        period.setStartTime(requestDto.getStartTime());
        period.setEndTime(requestDto.getEndTime());
        period.setMaxCreditsAllowed(requestDto.getMaxCreditsAllowed());
        if (requestDto.getActive() != null) {
            period.setActive(requestDto.getActive());
        }

        RegistrationPeriod updated = registrationPeriodRepository.save(period);
        log.info("REGISTRATION_PERIOD_UPDATED id={} name='{}' active={}", updated.getId(), updated.getName(), updated.getActive());

        return toDto(updated, LocalDateTime.now());
    }

    @Override
    @Transactional
    public void toggleActive(Long id) {
        RegistrationPeriod period = registrationPeriodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy đợt đăng ký tín chỉ có ID: " + id));
        period.setActive(!Boolean.TRUE.equals(period.getActive()));
        registrationPeriodRepository.save(period);
        log.info("REGISTRATION_PERIOD_TOGGLED id={} newActive={}", period.getId(), period.getActive());
    }

    @Override
    @Transactional
    public void deleteRegistrationPeriod(Long id) {
        RegistrationPeriod period = registrationPeriodRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy đợt đăng ký tín chỉ có ID: " + id));
        period.setDeleted(true);
        registrationPeriodRepository.save(period);
        log.info("REGISTRATION_PERIOD_DELETED id={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RegistrationPeriodResponseDto> getCurrentlyActivePeriods() {
        LocalDateTime now = LocalDateTime.now();
        return registrationPeriodRepository.findActivePeriodsAt(now).stream()
                .map(period -> toDto(period, now))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public RegistrationPeriod getActivePeriodForRegistration() {
        LocalDateTime now = LocalDateTime.now();
        List<RegistrationPeriod> activePeriods = registrationPeriodRepository.findActivePeriodsAt(now);
        if (activePeriods.isEmpty()) {
            throw new BusinessException(ErrorCode.REGISTRATION_PERIOD_CLOSED, 
                    "Hiện tại không có đợt đăng ký tín chỉ nào đang mở. Vui lòng quay lại sau.");
        }
        return activePeriods.get(0);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isPeriodOpen(Long periodId, LocalDateTime now) {
        return registrationPeriodRepository.findById(periodId)
                .map(p -> p.isCurrentlyOpen(now))
                .orElse(false);
    }

    private void validateTimeRange(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Thời gian bắt đầu và kết thúc không được để trống.");
        }
        if (!end.isAfter(start)) {
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Thời gian kết thúc đợt đăng ký phải sau thời gian bắt đầu.");
        }
    }

    private RegistrationPeriodResponseDto toDto(RegistrationPeriod period, LocalDateTime now) {
        Semester sem = period.getSemester();
        return RegistrationPeriodResponseDto.builder()
                .id(period.getId())
                .name(period.getName())
                .semesterId(sem != null ? sem.getId() : null)
                .semesterName(sem != null ? sem.getName() : null)
                .semesterCode(sem != null ? sem.getSemesterCode() : null)
                .academicYearName(sem != null && sem.getAcademicYear() != null ? sem.getAcademicYear().getAcademicYearName() : null)
                .startTime(period.getStartTime())
                .endTime(period.getEndTime())
                .maxCreditsAllowed(period.getMaxCreditsAllowed())
                .active(period.getActive())
                .isCurrentlyOpen(period.isCurrentlyOpen(now))
                .build();
    }
}
