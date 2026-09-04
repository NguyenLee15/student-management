// cSpell:disable
package com.student.management.service;

import com.student.management.dto.resp.AuditLogResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {
    void log(String action, String entityName, String entityId, String details, String performedBy);
    Page<AuditLogResponseDto> getAll(Pageable pageable);
}
