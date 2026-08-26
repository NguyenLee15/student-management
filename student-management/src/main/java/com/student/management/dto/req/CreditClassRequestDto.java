package com.student.management.dto.req;

import com.student.management.enums.Semester;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreditClassRequestDto {
    private Long creditClassId;

    private String creditClassName;

    @NotBlank(message = "Subject ID is required")
    private String subjectId;

    @NotBlank(message = "Teacher ID is required")
    private String teacherId;

    @NotBlank(message = "Classroom ID is required")
    private String classroomId;

    @NotBlank(message = "Academic year ID is required")
    private String academicYearId;

    @NotNull(message = "Semester is required")
    private Semester semester;

    @NotNull(message = "Max students is required")
    @Min(value = 1, message = "Max students must be at least 1")
    private Integer maxStudents;
}
