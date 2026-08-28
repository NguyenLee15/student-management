// cSpell:disable
package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TeacherResponseDto {
    private String teacherId;
    private String fullName;
    private String email;
    private String facultyId;
    private String facultyName;
}

