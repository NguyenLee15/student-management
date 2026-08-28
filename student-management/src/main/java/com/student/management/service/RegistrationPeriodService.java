// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.RegistrationPeriodRequestDto;
import com.student.management.dto.resp.RegistrationPeriodResponseDto;
import com.student.management.entity.RegistrationPeriod;

import java.time.LocalDateTime;
import java.util.List;

public interface RegistrationPeriodService {
    List<RegistrationPeriodResponseDto> getAllRegistrationPeriods();
    RegistrationPeriodResponseDto getRegistrationPeriodById(Long id);
    RegistrationPeriodResponseDto createRegistrationPeriod(RegistrationPeriodRequestDto requestDto);
    RegistrationPeriodResponseDto updateRegistrationPeriod(Long id, RegistrationPeriodRequestDto requestDto);
    void toggleActive(Long id);
    void deleteRegistrationPeriod(Long id);
    
    // Core Domain queries
    List<RegistrationPeriodResponseDto> getCurrentlyActivePeriods();
    RegistrationPeriod getActivePeriodForRegistration();
    boolean isPeriodOpen(Long periodId, LocalDateTime now);
}
