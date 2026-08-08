package com.student.management.controller.api;

import com.student.management.dto.req.StudentClassRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.StudentClassResponseDto;
import com.student.management.service.StudentClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/classes")
@Tag(name = "Student Classes API", description = "Endpoints for managing student classes")
public class StudentClassRestController {

    @Autowired
    private StudentClassService studentClassService;

    @GetMapping
    @Operation(summary = "Get all classes (Paged or List)")
    public ResponseEntity<ApiResponse<Object>> getAllClasses(
            @RequestParam(required = false) String facultyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unpaged) {

        if (unpaged) {
            List<StudentClassResponseDto> list = studentClassService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Classes fetched successfully", list));
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("classId"));
        Page<StudentClassResponseDto> result;
        if (facultyId != null && !facultyId.trim().isEmpty()) {
            result = studentClassService.getByFacultyId(facultyId, pageRequest);
        } else {
            result = studentClassService.getAll(pageRequest);
        }
        return ResponseEntity.ok(ApiResponse.success("Classes fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get class details by ID")
    public ResponseEntity<ApiResponse<StudentClassResponseDto>> getById(@PathVariable String id) {
        StudentClassResponseDto dto = studentClassService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new student class")
    public ResponseEntity<ApiResponse<StudentClassResponseDto>> create(@Valid @RequestBody StudentClassRequestDto dto) {
        StudentClassResponseDto created = studentClassService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Class created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student class")
    public ResponseEntity<ApiResponse<StudentClassResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody StudentClassRequestDto dto) {
        StudentClassResponseDto updated = studentClassService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Class updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a student class by ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        studentClassService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Class deleted successfully", null));
    }
}

