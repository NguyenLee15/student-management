// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.StudentClassRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.StudentClassResponseDto;
import com.student.management.service.StudentClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/v1/classes")
@Tag(name = "API Quản Lý Lớp Sinh Viên Hành Chính", description = "Quản lý lớp học sinh viên")
@PreAuthorize("hasRole('ADMIN')")
@lombok.RequiredArgsConstructor
public class StudentClassRestController {

    private final StudentClassService studentClassService;

    @GetMapping
    @Operation(summary = "Lấy danh sách lớp học (Phân trang hoặc danh sách)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Object>> getAllClasses(
            @RequestParam(required = false) String facultyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unpaged) {

        if (unpaged) {
            List<StudentClassResponseDto> list = studentClassService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp học thành công", list));
        }

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("classId"));
        Page<StudentClassResponseDto> result;
        if (facultyId != null && !facultyId.trim().isEmpty()) {
            result = studentClassService.getByFacultyId(facultyId, pageRequest);
        } else {
            result = studentClassService.getAll(pageRequest);
        }
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp học thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết lớp học theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<StudentClassResponseDto>> getById(@PathVariable String id) {
        StudentClassResponseDto dto = studentClassService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Tạo lớp học mới")
    public ResponseEntity<ApiResponse<StudentClassResponseDto>> create(@Valid @RequestBody StudentClassRequestDto dto) {
        StudentClassResponseDto created = studentClassService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới lớp học thành công", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật lớp học")
    public ResponseEntity<ApiResponse<StudentClassResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody StudentClassRequestDto dto) {
        StudentClassResponseDto updated = studentClassService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp học thành công", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa lớp học theo ID")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        studentClassService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp học thành công", null));
    }
}


