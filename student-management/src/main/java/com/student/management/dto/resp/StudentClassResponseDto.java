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
public class StudentClassResponseDto {
    private String classId;
    private String className;
    private String facultyId;
    private String facultyName;
}

