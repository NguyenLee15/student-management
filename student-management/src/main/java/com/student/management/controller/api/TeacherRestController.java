package com.student.management.controller.api;

import com.student.management.dto.req.TeacherRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.TeacherResponseDto;
import com.student.management.service.TeacherService;
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
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@Tag(name = "Teachers API", description = "Endpoints for managing university teachers/lecturers")
public class TeacherRestController {

    private final TeacherService teacherService;

    @GetMapping
    @Operation(summary = "Get all teachers with pagination and search")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Page<TeacherResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String facultyId) {
        Page<TeacherResponseDto> result = teacherService.searchAndFilter(keyword, facultyId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Teachers fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get teacher by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<TeacherResponseDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(teacherService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherResponseDto>> create(@Valid @RequestBody TeacherRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Teacher created successfully", teacherService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherResponseDto>> update(@PathVariable String id, @Valid @RequestBody TeacherRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Teacher updated successfully", teacherService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        teacherService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Teacher deleted successfully", null));
    }
}

