package com.student.management.dto.resp;

import com.student.management.enums.TuitionItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TuitionItemResponseDto {
    private Long id;
    private Long enrollmentId;
    private Long creditClassId;
    private String classCode;
    private String subjectId;
    private String subjectName;
    private Integer credits;
    private BigDecimal unitPrice;
    private BigDecimal amount;
    private TuitionItemStatus status;
}
