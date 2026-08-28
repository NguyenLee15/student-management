// cSpell:disable
package com.student.management.dto.req;

import com.student.management.enums.SubjectType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubjectRequestDto {

    @NotBlank(message = "Subject ID cannot be blank")
    @Size(max = 10, message = "Subject ID cannot exceed 10 characters")
    private String subjectId;

    @NotBlank(message = "Subject name cannot be blank")
    @Size(max = 100, message = "Subject name cannot exceed 100 characters")
    private String subjectName;

    @NotNull(message = "Subject type cannot be null")
    private SubjectType subjectType;

    @NotNull(message = "Tuition per credit cannot be null")
    @Min(value = 1, message = "Tuition per credit must be greater than 0")
    private Integer tuitionPerCredit;

    @NotNull(message = "Credits cannot be null")
    @Min(value = 1, message = "Credits must be greater than 0")
    private Integer credits;

    @NotBlank(message = "Faculty ID cannot be blank")
    private String facultyId;

    private String prerequisiteSubjectId;
}
