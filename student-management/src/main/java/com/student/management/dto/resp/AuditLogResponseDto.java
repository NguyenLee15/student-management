// cSpell:disable
package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuditLogResponseDto {
    private Long id;
    private String action;
    private String entityName;
    private String entityId;
    private String details;
    private String performedBy;
    private LocalDateTime timestamp;
}
