package com.student.management.dto.req;

import jakarta.validation.constraints.Email;
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
public class TeacherRequestDto {

    @NotBlank(message = "Teacher ID cannot be blank")
    @Size(max = 10, message = "Teacher ID cannot exceed 10 characters")
    private String teacherId;

    @NotBlank(message = "Full name cannot be blank")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email is invalid")
    private String email;

    @NotBlank(message = "Faculty ID cannot be blank")
    private String facultyId;
}

