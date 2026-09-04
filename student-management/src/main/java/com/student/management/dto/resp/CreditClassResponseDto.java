// cSpell:disable
package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditClassResponseDto {
    private Long creditClassId;
    private String creditClassName;
    private String subjectId;
    private String subjectName;
    private Integer credits;
    private String teacherId;
    private String teacherName;
    private String classroomId;
    private String roomName;
    private String academicYearId;
    private String academicYearName;
    private Long semesterId;
    private String semesterName;
    private String semester;
    private Integer maxStudents;
    private Integer enrolledCount;
    private BigDecimal attendanceWeight;
    private BigDecimal midtermWeight;
    private BigDecimal finalExamWeight;
    private Boolean locked;
    private String studyTime;
    private String shiftName;
    private BigDecimal unitPrice;
}
