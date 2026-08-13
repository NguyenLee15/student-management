package com.student.management.controller.api;

import com.student.management.dto.req.StudentRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.StudentResponseDto;
import com.student.management.service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import com.student.management.service.AsyncImportService;
import com.student.management.entity.ImportTask;
import com.student.management.repository.ImportTaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/students")
@Tag(name = "Students API", description = "Endpoints for managing university students, filtering, and Excel import/export")
public class StudentRestController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private AsyncImportService asyncImportService;
    
    @Autowired
    private ImportTaskRepository importTaskRepository;

    @GetMapping
    @Operation(summary = "Search and filter students with pagination")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Page<StudentResponseDto>>> getStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "studentId") String sortBy,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String classId,
            @RequestParam(required = false) String facultyId,
            @RequestParam(required = false) String academicYearId) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(sortBy));
        Page<StudentResponseDto> result = studentService.searchAndFilter(keyword, classId, facultyId, academicYearId, pageRequest);
        return ResponseEntity.ok(ApiResponse.success("Students fetched successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get student details by Student ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER') or (hasRole('STUDENT') and @securityService.isSelfStudent(#id))")
    public ResponseEntity<ApiResponse<StudentResponseDto>> getById(@PathVariable String id) {
        StudentResponseDto dto = studentService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Create a new student")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDto>> create(@Valid @RequestBody StudentRequestDto dto) {
        StudentResponseDto created = studentService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Student created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing student")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StudentResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody StudentRequestDto dto) {
        StudentResponseDto updated = studentService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Student updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a student by ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        studentService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Student deleted successfully", null));
    }

    @PostMapping("/import")
    @Operation(summary = "Import student list from Excel file asynchronously (.xlsx)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Map<String, String>>> importExcel(@RequestParam("file") MultipartFile file) {
        try {
            String taskId = java.util.UUID.randomUUID().toString();
            
            ImportTask task = new ImportTask();
            task.setTaskId(taskId);
            task.setStatus("PENDING");
            importTaskRepository.save(task);
            
            byte[] fileBytes = file.getBytes();
            asyncImportService.processExcelImport(taskId, fileBytes);
            
            java.util.Map<String, String> data = new java.util.HashMap<>();
            data.put("taskId", taskId);
            
            return ResponseEntity.accepted().body(ApiResponse.success("Excel import started asynchronously", data));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Failed to read file: " + e.getMessage()));
        }
    }

    @GetMapping("/import-tasks/{taskId}")
    @Operation(summary = "Get async import task status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ImportTask>> getImportTask(@PathVariable String taskId) {
        return importTaskRepository.findById(taskId)
                .map(task -> ResponseEntity.ok(ApiResponse.success(task)))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error(HttpStatus.NOT_FOUND.value(), "Task not found")));
    }

    @GetMapping("/export")
    @Operation(summary = "Export student list to Excel file (.xlsx)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<InputStreamResource> exportExcel() {
        List<StudentResponseDto> list = studentService.getAllForExport();
        ByteArrayInputStream in = studentService.exportToExcel(list);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=students_export.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
}

