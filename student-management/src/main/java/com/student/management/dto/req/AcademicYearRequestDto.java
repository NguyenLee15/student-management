package com.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicYearRequestDto {

    @NotBlank(message = "Academic year ID cannot be blank")
    @Size(max = 10, message = "Academic year ID cannot exceed 10 characters")
    private String academicYearId;

    @NotBlank(message = "Academic year name cannot be blank")
    @Size(max = 50, message = "Academic year name cannot exceed 50 characters")
    private String academicYearName;
}

