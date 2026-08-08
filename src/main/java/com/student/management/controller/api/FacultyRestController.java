package com.student.management.controller.api;

import com.student.management.dto.req.FacultyRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.FacultyResponseDto;
import com.student.management.service.FacultyService;
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
@RequestMapping("/api/v1/faculties")
@Tag(name = "Faculties API", description = "Endpoints for managing university faculties")
public class FacultyRestController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping
    @Operation(summary = "Get all faculties (Paged or List)")
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unpaged) {

        if (unpaged) {
            List<FacultyResponseDto> list = facultyService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Faculties fetched successfully", list));
        }

        Page<FacultyResponseDto> result = facultyService.getAll(PageRequest.of(page, size, Sort.by("facultyId")));
        return ResponseEntity.ok(ApiResponse.success("Faculties fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get faculty details by ID")
    public ResponseEntity<ApiResponse<FacultyResponseDto>> getById(@PathVariable String id) {
        FacultyResponseDto dto = facultyService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new faculty")
    public ResponseEntity<ApiResponse<FacultyResponseDto>> create(@Valid @RequestBody FacultyRequestDto dto) {
        FacultyResponseDto created = facultyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Faculty created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing faculty")
    public ResponseEntity<ApiResponse<FacultyResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody FacultyRequestDto dto) {
        FacultyResponseDto updated = facultyService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Faculty updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a faculty by ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        facultyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Faculty deleted successfully", null));
    }
}

