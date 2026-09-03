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

    @NotBlank(message = "Mã sinh viên không được để trống")
    private String studentId;

    @NotBlank(message = "Mã môn học không được để trống")
    private String subjectId;

    @NotNull(message = "Học kỳ không được để trống")
    private Semester semester;

    @NotBlank(message = "Năm học không được để trống")
    @Size(max = 9, message = "Năm học không được vượt quá 9 ký tự")
    private String academicYear;

    @NotNull(message = "Study phase không được để trống")
    private StudyPhase studyPhase;

    @DecimalMin(value = "0.0", inclusive = true, message = "Scale 10 score must be >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Scale 10 score must be <= 10")
    private BigDecimal scoreScale10;

    @DecimalMin(value = "0.0", inclusive = true, message = "Scale 4 score must be >= 0")
    @DecimalMax(value = "4.0", inclusive = true, message = "Scale 4 score must be <= 4")
    private BigDecimal scoreScale4;

    @DecimalMin(value = "0.0", inclusive = true, message = "Attendance score must be >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Attendance score must be <= 10")
    private BigDecimal attendanceScore;

    @DecimalMin(value = "0.0", inclusive = true, message = "Midterm score must be >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Midterm score must be <= 10")
    private BigDecimal midtermScore;

    @DecimalMin(value = "0.0", inclusive = true, message = "Final exam score must be >= 0")
    @DecimalMax(value = "10.0", inclusive = true, message = "Final exam score must be <= 10")
    private BigDecimal finalExamScore;

    private String letterGrade;
}

