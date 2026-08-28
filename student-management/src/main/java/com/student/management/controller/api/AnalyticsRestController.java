// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.resp.ApiResponse;
import com.student.management.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor
@Tag(name = "Analytics API", description = "Endpoints for academic performance and statistics analytics")
public class AnalyticsRestController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    @Operation(summary = "Get high-level institutional summary metrics")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success("Analytics summary fetched successfully", analyticsService.getSystemSummary()));
    }

    @GetMapping("/faculty-distribution")
    @Operation(summary = "Get student distribution by academic faculty")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFacultyDistribution() {
        return ResponseEntity.ok(ApiResponse.success("Faculty distribution fetched successfully", analyticsService.getFacultyDistribution()));
    }

    @GetMapping("/gpa-distribution")
    @Operation(summary = "Get GPA academic classification breakdown")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGpaDistribution() {
        return ResponseEntity.ok(ApiResponse.success("GPA distribution fetched successfully", analyticsService.getGpaDistribution()));
    }
}
