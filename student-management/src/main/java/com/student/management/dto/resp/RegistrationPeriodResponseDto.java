package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationPeriodResponseDto {
    private Long id;
    private String name;
    private Long semesterId;
    private String semesterName;
    private String semesterCode;
    private String academicYearName;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxCreditsAllowed;
    private Boolean active;
    private Boolean isCurrentlyOpen;
}
