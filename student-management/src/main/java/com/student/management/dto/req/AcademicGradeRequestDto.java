// cSpell:disable
package com.student.management.dto.req;

import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicGradeRequestDto {

    private Integer gradeId;

    @NotBlank(message = "Student ID cannot be blank")
    private String studentId;

    @NotBlank(message = "Subject ID cannot be blank")
    private String subjectId;

    @NotNull(message = "Semester cannot be null")
    private Semester semester;

    @NotBlank(message = "Academic year cannot be blank")
    @Size(max = 9, message = "Academic year cannot exceed 9 characters")
    private String academicYear;

    @NotNull(message = "Study phase cannot be null")
    private StudyPhase studyPhase;

    @DecimalMin(value = "0.0", inclusive = true, message = "Scale 10 score must be >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Scale 10 score must be <= 10")
    private BigDecimal scoreScale10;

    @DecimalMin(value = "0.0", inclusive = true, message = "Scale 4 score must be >= 0")
    @DecimalMax(value = "4.0", inclusive = true, message = "Scale 4 score must be <= 4")
    private BigDecimal scoreScale4;

    private String letterGrade;
}

