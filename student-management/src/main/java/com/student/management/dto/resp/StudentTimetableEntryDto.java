// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.ClassShift;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentTimetableEntryDto {
    private Long scheduleId;
    private Long creditClassId;
    private String classCode;
    private String subjectId;
    private String subjectName;
    private Integer credits;
    private String teacherName;
    private String roomName;
    private String studyTime;
    private ClassShift classShift;
    private String shiftName;
    private LocalDate startDate;
    private LocalDate endDate;
}
