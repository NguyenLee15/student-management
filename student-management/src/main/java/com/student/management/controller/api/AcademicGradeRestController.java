package com.student.management.controller.api;

import com.student.management.dto.req.AcademicGradeRequestDto;
import com.student.management.dto.req.AcademicGradeUpdateDto;
import com.student.management.dto.resp.AcademicGradeResponseDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import com.student.management.service.AcademicGradeService;
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
@RequestMapping("/api/v1/academic-grades")
@RequiredArgsConstructor
@Tag(name = "Academic Grades API", description = "Endpoints for managing student academic grades and scores")
public class AcademicGradeRestController {

    private final AcademicGradeService academicGradeService;

    @GetMapping
    @Operation(summary = "Get all academic grades with filters and pagination")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or (hasRole('STUDENT') and #studentId != null and @securityService.isSelfStudent(#studentId))")
    public ResponseEntity<ApiResponse<Page<AcademicGradeResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String studentId,
            @RequestParam(required = false) String subjectId,
            @RequestParam(required = false) Semester semester,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) StudyPhase studyPhase) {
        Page<AcademicGradeResponseDto> result = academicGradeService.searchAndFilter(
                studentId, subjectId, semester, academicYear, studyPhase, PageRequest.of(page, size)
        );
        return ResponseEntity.ok(ApiResponse.success("Grades fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get grade by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or hasRole('STUDENT')") // In a real app, verify the grade belongs to the student in the service layer
    public ResponseEntity<ApiResponse<AcademicGradeResponseDto>> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(academicGradeService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create grade")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<AcademicGradeResponseDto>> create(@Valid @RequestBody AcademicGradeRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Grade created successfully", academicGradeService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update grade")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<AcademicGradeResponseDto>> update(@PathVariable Integer id, @Valid @RequestBody AcademicGradeUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Grade updated successfully", academicGradeService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete grade")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Integer id) {
        academicGradeService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Grade deleted successfully", null));
    }
}

