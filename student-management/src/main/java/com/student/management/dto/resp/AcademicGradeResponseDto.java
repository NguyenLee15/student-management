// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicGradeResponseDto {
    private Integer gradeId;
    private String studentId;
    private String studentName;
    private String subjectId;
    private String subjectName;
    private Semester semester;
    private String academicYear;
    private StudyPhase studyPhase;
    private BigDecimal scoreScale10;
    private BigDecimal scoreScale4;
    private String letterGrade;
    private BigDecimal attendanceScore;
    private BigDecimal midtermScore;
    private BigDecimal finalExamScore;
}

