package com.student.management.dto.resp;

import com.student.management.enums.SubjectType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubjectResponseDto {
    private String subjectId;
    private String subjectName;
    private SubjectType subjectType;
    private Integer tuitionPerCredit;
    private Integer credits;
    private String facultyId;
    private String facultyName;
    private String prerequisiteSubjectId;
    private String prerequisiteSubjectName;
}
