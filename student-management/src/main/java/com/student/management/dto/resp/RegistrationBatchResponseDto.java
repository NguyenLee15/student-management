package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationBatchResponseDto {
    private boolean success;
    private int registeredClassCount;
    private int totalRegisteredCredits;
    private Long invoiceId;
    private BigDecimal totalTuitionAmount;
    private List<EnrollmentResponseDto> enrollments;
    private String message;
}
