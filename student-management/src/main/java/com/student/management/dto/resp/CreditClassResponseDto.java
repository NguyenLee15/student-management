package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreditClassResponseDto {
    private Long creditClassId;
    private String creditClassName;
    private String subjectId;
    private String subjectName;
}

