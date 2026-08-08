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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/credit-classes")
@RequiredArgsConstructor
@Tag(name = "Credit Classes API", description = "Endpoints for managing credit classes and student enrollments")
public class CreditClassRestController {

    private final CreditClassService creditClassService;

    @GetMapping
    @Operation(summary = "Get all credit classes")
    public ResponseEntity<ApiResponse<List<CreditClassResponseDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Credit classes fetched successfully", creditClassService.getAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get credit class by ID")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(creditClassService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create credit class")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> create(@Valid @RequestBody CreditClassRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Credit class created successfully", creditClassService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update credit class")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> update(@PathVariable Long id, @Valid @RequestBody CreditClassRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Credit class updated successfully", creditClassService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete credit class")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        creditClassService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Credit class deleted successfully", null));
    }

    @PostMapping("/{id}/students/{studentId}")
    @Operation(summary = "Enroll a student into credit class")
    public ResponseEntity<ApiResponse<Void>> enrollStudent(@PathVariable Long id, @PathVariable String studentId) {
        creditClassService.addStudentToCreditClass(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Student enrolled successfully", null));
    }

    @DeleteMapping("/{id}/students/{studentId}")
    @Operation(summary = "Remove a student from credit class")
    public ResponseEntity<ApiResponse<Void>> removeStudent(@PathVariable Long id, @PathVariable String studentId) {
        creditClassService.removeStudentFromCreditClass(id, studentId);
        return ResponseEntity.ok(ApiResponse.success("Student removed successfully", null));
    }
}

