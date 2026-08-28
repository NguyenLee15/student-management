// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.exception.ErrorCode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ValidationViolationDto {
    private ErrorCode errorCode;
    private String code;
    private Long creditClassId;
    private String classCode;
    private String subjectId;
    private String subjectName;
    private String message;
    private String severity; // "ERROR" hoặc "WARNING"
}
