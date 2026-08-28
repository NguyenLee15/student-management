// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.resp.ApiResponse;
import com.student.management.entity.AuditLog;
import com.student.management.service.AuditLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/audit-logs")
@RequiredArgsConstructor
@Tag(name = "Audit Log API", description = "Endpoints for retrieving system activity history")
public class AuditLogRestController {

    private final AuditLogService auditLogService;

    @GetMapping
    @Operation(summary = "Get audit logs with pagination and filters")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<AuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<AuditLog> result = auditLogService.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Audit logs fetched successfully", result));
    }
}
