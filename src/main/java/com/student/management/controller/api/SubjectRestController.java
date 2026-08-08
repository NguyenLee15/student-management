package com.student.management.controller.api;

import com.student.management.dto.req.SubjectRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.SubjectResponseDto;
import com.student.management.service.SubjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
@Tag(name = "Subjects API", description = "Endpoints for managing subjects/courses")
public class SubjectRestController {

    private final SubjectService subjectService;

    @GetMapping
    @Operation(summary = "Get all subjects with pagination")
    public ResponseEntity<ApiResponse<Page<SubjectResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SubjectResponseDto> result = subjectService.getAll(page, size);
        return ResponseEntity.ok(ApiResponse.success("Subjects fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get subject by ID")
    public ResponseEntity<ApiResponse<SubjectResponseDto>> getById(@PathVariable String id) {
        return subjectService.getById(id)
                .map(s -> ResponseEntity.ok(ApiResponse.success(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create subject")
    public ResponseEntity<ApiResponse<SubjectResponseDto>> create(@Valid @RequestBody SubjectRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subject created successfully", subjectService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update subject")
    public ResponseEntity<ApiResponse<SubjectResponseDto>> update(@PathVariable String id, @Valid @RequestBody SubjectRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Subject updated successfully", subjectService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete subject")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        subjectService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Subject deleted successfully", null));
    }
}

