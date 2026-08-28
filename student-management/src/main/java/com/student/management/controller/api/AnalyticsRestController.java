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
@Tag(name = "API Thống Kê & Báo Cáo", description = "Thống kê hiệu suất học tập và phân tích dữ liệu")
public class AnalyticsRestController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    @Operation(summary = "Lấy thống kê tổng quan hệ thống")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSummary() {
        return ResponseEntity.ok(ApiResponse.success("Lấy thống kê tổng quan thành công", analyticsService.getSystemSummary()));
    }

    @GetMapping("/faculty-distribution")
    @Operation(summary = "Lấy phân bố sinh viên theo khoa")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getFacultyDistribution() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phân bố theo khoa thành công", analyticsService.getFacultyDistribution()));
    }

    @GetMapping("/gpa-distribution")
    @Operation(summary = "Lấy phân bố xếp loại điểm GPA")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getGpaDistribution() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phân bố điểm GPA thành công", analyticsService.getGpaDistribution()));
    }
}
