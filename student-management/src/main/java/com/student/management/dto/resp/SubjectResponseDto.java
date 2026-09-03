// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.SubjectType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubjectResponseDto {
    private String subjectId;
    private String subjectName;
    private SubjectType subjectType;
    private Integer tuitionPerCredit;
    private Integer credits;
    private String facultyId;
    private String facultyName;
    private String prerequisiteSubjectId;
    private String prerequisiteSubjectName;
    private BigDecimal attendanceWeight;
    private BigDecimal midtermWeight;
    private BigDecimal finalExamWeight;
}
