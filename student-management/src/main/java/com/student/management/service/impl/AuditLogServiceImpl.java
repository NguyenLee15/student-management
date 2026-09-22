// cSpell:disable
package com.student.management.service.impl;

import com.student.management.entity.AuditLog;
import com.student.management.repository.AuditLogRepository;
import com.student.management.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Override
    public void log(String action, String entityName, String entityId, String details, String performedBy) {
        // Derive actor from SecurityContext for trustworthy audit trail
        String actor = performedBy;
        try {
            org.springframework.security.core.Authentication auth =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                actor = auth.getName();
            }
        } catch (Exception ignored) {
            // Fallback to provided performedBy (e.g. during system/scheduler operations)
        }
        if (actor == null || actor.isBlank()) {
            actor = "system";
        }
        AuditLog auditLog = AuditLog.builder()
                .action(action)
                .entityName(entityName)
                .entityId(entityId)
                .details(details)
                .performedBy(actor)
                .timestamp(LocalDateTime.now())
                .build();
        auditLogRepository.save(auditLog);
    }

    @Override
    public Page<com.student.management.dto.resp.AuditLogResponseDto> getAll(Pageable pageable) {
        return auditLogRepository.findAllByOrderByTimestampDesc(pageable)
                .map(this::toDto);
    }

    private com.student.management.dto.resp.AuditLogResponseDto toDto(AuditLog log) {
        return com.student.management.dto.resp.AuditLogResponseDto.builder()
                .id(log.getId())
                .action(log.getAction())
                .entityName(log.getEntityName())
                .entityId(log.getEntityId())
                .details(log.getDetails())
                .performedBy(log.getPerformedBy())
                .timestamp(log.getTimestamp())
                .build();
    }
}
