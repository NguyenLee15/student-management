// cSpell:disable
package com.student.management.dto.req;

import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicGradeUpdateDto {

    @NotNull(message = "Grade ID cannot be null")
    private Integer gradeId;

    @NotNull(message = "Semester cannot be null")
    private Semester semester;

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

