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
public class FacultyRequestDto {

    @NotBlank(message = "Faculty ID cannot be blank")
    @Size(max = 10, message = "Faculty ID cannot exceed 10 characters")
    private String facultyId;

    @NotBlank(message = "Faculty name cannot be blank")
    @Size(max = 100, message = "Faculty name cannot exceed 100 characters")
    private String facultyName;
}

