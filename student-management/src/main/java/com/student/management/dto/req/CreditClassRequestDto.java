// cSpell:disable
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

    @NotBlank(message = "Mã môn học là bắt buộc")
    private String subjectId;

    @NotBlank(message = "Mã giảng viên là bắt buộc")
    private String teacherId;

    @NotBlank(message = "Classroom ID là bắt buộc")
    private String classroomId;

    @NotBlank(message = "Mã năm học là bắt buộc")
    private String academicYearId;

    @NotNull(message = "Học kỳ là bắt buộc")
    private Semester semester;

    @NotNull(message = "Max students là bắt buộc")
    @Min(value = 1, message = "Max students must be at least 1")
    private Integer maxStudents;
}
