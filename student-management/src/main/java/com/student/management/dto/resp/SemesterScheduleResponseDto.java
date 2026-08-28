// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SemesterScheduleResponseDto {
    private Long scheduleId;
    private Long creditClassId;
    private String creditClassName;
    private String subjectId;
    private String subjectName;
    private String teacherId;
    private String teacherName;
    private String roomId;
    private String roomName;
    private Semester semester;
    private String academicYear;
    private String studyTime;
    private ClassShift classShift;
    private LocalDate startDate;
    private LocalDate endDate;
}

