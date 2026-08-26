package com.student.management.dto.resp;

import com.student.management.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentResponseDto {
    private Long id;
    private String studentId;
    private String studentName;
    private Long creditClassId;
    private String classCode;
    private String subjectId;
    private String subjectName;
    private Integer credits;
    private String teacherName;
    private String roomName;
    private Long semesterId;
    private String semesterName;
    private LocalDateTime enrollmentDate;
    private EnrollmentStatus status;
    private String statusName;
    private LocalDateTime dropDate;
}
