// cSpell:disable
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
public class StudentClassRequestDto {

    @NotBlank(message = "Class ID cannot be blank")
    @Size(max = 10, message = "Class ID cannot exceed 10 characters")
    private String classId;

    @NotBlank(message = "Class name cannot be blank")
    @Size(max = 100, message = "Class name cannot exceed 100 characters")
    private String className;

    @NotBlank(message = "Faculty ID cannot be blank")
    private String facultyId;
}

