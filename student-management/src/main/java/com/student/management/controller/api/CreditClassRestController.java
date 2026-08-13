package com.student.management.controller.api;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.service.CreditClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

@RestController
@RequestMapping("/api/v1/credit-classes")
@RequiredArgsConstructor
@Tag(name = "Credit Classes API", description = "Endpoints for managing credit classes and student enrollments")
public class CreditClassRestController {

    private final CreditClassService creditClassService;

    @GetMapping
    @Operation(summary = "Get all credit classes with pagination and search")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unpaged) {

        if (unpaged) {
            return ResponseEntity.ok(ApiResponse.success("Credit classes fetched successfully", creditClassService.getAll()));
        }

        Page<CreditClassResponseDto> result = creditClassService.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Credit classes fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get credit class by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(creditClassService.getById(Long.valueOf(id))));
    }

    @PostMapping
    @Operation(summary = "Create credit class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> create(@Valid @RequestBody CreditClassRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Credit class created successfully", creditClassService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update credit class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> update(@PathVariable String id, @Valid @RequestBody CreditClassRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Credit class updated successfully", creditClassService.update(Long.valueOf(id), dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete credit class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        creditClassService.delete(Long.valueOf(id));
        return ResponseEntity.ok(ApiResponse.success("Credit class deleted successfully", null));
    }

    @PostMapping("/{classId}/students/{studentId}")
    @Operation(summary = "Add student to credit class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> addStudent(@PathVariable String classId, @PathVariable String studentId) {
        creditClassService.addStudentToCreditClass(Long.valueOf(classId), studentId);
        return ResponseEntity.ok(ApiResponse.success("Student enrolled successfully", null));
    }

    @DeleteMapping("/{classId}/students/{studentId}")
    @Operation(summary = "Remove student from credit class")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> removeStudent(@PathVariable String classId, @PathVariable String studentId) {
        creditClassService.removeStudentFromCreditClass(Long.valueOf(classId), studentId);
        return ResponseEntity.ok(ApiResponse.success("Student removed successfully", null));
    }
}
