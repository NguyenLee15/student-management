package com.student.management.dto.req;

import com.student.management.enums.Gender;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentRequestDto {

    @NotBlank(message = "Student ID cannot be blank")
    @Size(max = 10, message = "Student ID cannot exceed 10 characters")
    private String studentId;

    @NotBlank(message = "Full name cannot be blank")
    @Size(max = 100, message = "Full name cannot exceed 100 characters")
    private String fullName;

    @Past(message = "Date of birth must be in the past")
    private LocalDate dateOfBirth;

    @NotNull(message = "Gender cannot be null")
    private Gender gender;

    @NotBlank(message = "Class ID cannot be blank")
    private String classId;

    @NotBlank(message = "Academic year ID cannot be blank")
    private String academicYearId;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Email is invalid")
    private String email;
}

