// cSpell:disable
package com.student.management.service;

import com.student.management.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AuditLogService {
    void log(String action, String entityName, String entityId, String details, String performedBy);
    Page<AuditLog> getAll(Pageable pageable);
}
