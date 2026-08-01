package com.example.student.management.dto.resp;

import com.example.student.management.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentResponseDto {
    private String studentId;
    private String fullName;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String classId;
    private String className;
    private String facultyId;
    private String facultyName;
    private String academicYearId;
    private String email;
}
