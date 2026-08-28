// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.AcademicYearRequestDto;
import com.student.management.dto.resp.AcademicYearResponseDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.service.AcademicYearService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/academic-years")
@RequiredArgsConstructor
@Tag(name = "Academic Years API", description = "Endpoints for managing academic years")
public class AcademicYearRestController {

    private final AcademicYearService academicYearService;

    @GetMapping
    @Operation(summary = "Get all academic years with pagination")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Page<AcademicYearResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<AcademicYearResponseDto> result = academicYearService.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Academic years fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get academic year by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<AcademicYearResponseDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(academicYearService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create academic year")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AcademicYearResponseDto>> create(@Valid @RequestBody AcademicYearRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Academic year created successfully", academicYearService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update academic year")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AcademicYearResponseDto>> update(@PathVariable String id, @Valid @RequestBody AcademicYearRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Academic year updated successfully", academicYearService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete academic year")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        academicYearService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Academic year deleted successfully", null));
    }
}

