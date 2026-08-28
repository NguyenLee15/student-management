// cSpell:disable
package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuitionPolicyResponseDto {
    private Long id;
    private Long semesterId;
    private String semesterName;
    private String semesterCode;
    private String facultyId;
    private String facultyName;
    private BigDecimal unitPricePerCredit;
    private LocalDate effectiveDate;
    private Boolean active;
    private String scope; // "TOÀN TRƯỜNG" hoặc "KHOA {facultyName}"
}
