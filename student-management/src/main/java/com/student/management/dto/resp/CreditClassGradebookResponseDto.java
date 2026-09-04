// cSpell:disable
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
@AllArgsConstructor
@NoArgsConstructor
public class CreditClassGradebookResponseDto {
    private Long creditClassId;
    private String creditClassName;
    private String subjectId;
    private String subjectName;
    private Integer credits;
    private String teacherId;
    private String teacherName;
    private String semester;
    private String academicYear;
    private BigDecimal attendanceWeight;
    private BigDecimal midtermWeight;
    private BigDecimal finalExamWeight;
    private Boolean locked;
    @Builder.Default
    private List<GradebookItemDto> items = new ArrayList<>();
}

