// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.FacultyRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.FacultyResponseDto;
import com.student.management.service.FacultyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/faculties")
@Tag(name = "API Quản Lý Khoa & Viện Đào Tạo", description = "Quản lý khoa trong trường")
@lombok.RequiredArgsConstructor
public class FacultyRestController {

    private final FacultyService facultyService;

    @GetMapping
    @Operation(summary = "Get all faculties (Paged or List)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unpaged) {

        if (unpaged) {
            List<FacultyResponseDto> list = facultyService.getAll();
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khoa thành công", list));
        }

        Page<FacultyResponseDto> result = facultyService.getAll(PageRequest.of(page, size, Sort.by("facultyId")));
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách khoa thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết khoa theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<FacultyResponseDto>> getById(@PathVariable String id) {
        FacultyResponseDto dto = facultyService.getById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    @Operation(summary = "Thêm khoa đào tạo mới")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FacultyResponseDto>> create(@Valid @RequestBody FacultyRequestDto dto) {
        FacultyResponseDto created = facultyService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới khoa thành công", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin khoa đào tạo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FacultyResponseDto>> update(
            @PathVariable String id,
            @Valid @RequestBody FacultyRequestDto dto) {
        FacultyResponseDto updated = facultyService.update(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật khoa thành công", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa khoa đào tạo theo ID")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        facultyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa khoa thành công", null));
    }
}

