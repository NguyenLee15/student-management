package com.example.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentClassRequestDto {
    @NotBlank(message = "Class ID is required")
    private String classId;

    @NotBlank(message = "Class name is required")
    private String className;

    @NotBlank(message = "Faculty ID is required")
    private String facultyId;
}
