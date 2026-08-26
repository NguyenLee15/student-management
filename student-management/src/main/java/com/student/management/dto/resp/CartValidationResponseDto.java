package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartValidationResponseDto {
    private boolean valid;
    private int totalSelectedCredits;
    private int currentRegisteredCredits;
    private int maxAllowedCredits;
    private BigDecimal estimatedTotalTuition;
    @Builder.Default
    private List<ValidationViolationDto> violations = new ArrayList<>();
}
