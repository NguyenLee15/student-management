// cSpell:disable
package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GradebookItemDto {
    private String studentId;
    private String studentName;
    private String className;
    private Integer gradeId;
    private BigDecimal attendanceScore;
    private BigDecimal midtermScore;
    private BigDecimal finalExamScore;
    private BigDecimal scoreScale10;
    private BigDecimal scoreScale4;
    private String letterGrade;
    private Boolean isPassed;
    private Long version;
}

