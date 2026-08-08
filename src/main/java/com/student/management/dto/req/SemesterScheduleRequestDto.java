package com.student.management.dto.req;

import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SemesterScheduleRequestDto {

    private Long scheduleId;

    @NotNull(message = "Credit class ID cannot be null")
    private Long creditClassId;

    @NotBlank(message = "Subject ID cannot be blank")
    private String subjectId;

    @NotBlank(message = "Teacher ID cannot be blank")
    private String teacherId;

    @NotBlank(message = "Room ID cannot be blank")
    private String roomId;

    @NotNull(message = "Semester cannot be null")
    private Semester semester;

    @NotBlank(message = "Academic year cannot be blank")
    private String academicYear;

    @NotBlank(message = "Study time cannot be blank")
    private String studyTime;

    @NotNull(message = "Class shift cannot be null")
    private ClassShift classShift;

    @NotNull(message = "Start date cannot be null")
    private LocalDate startDate;

    @NotNull(message = "End date cannot be null")
    private LocalDate endDate;

    @AssertTrue(message = "End date must be after or equal to start date")
    public boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }
}

