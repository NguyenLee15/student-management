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
public class FacultyRequestDto {
    @NotBlank(message = "Faculty ID is required")
    private String facultyId;

    @NotBlank(message = "Faculty name is required")
    private String facultyName;
}
