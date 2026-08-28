// cSpell:disable
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
@Tag(name = "Teachers API", description = "Quản lý giảng viên")
public class TeacherRestController {

    @GetMapping("/export")
    @Operation(summary = "Xuất danh sách giảng viên ra file Excel (.xlsx)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<org.springframework.core.io.InputStreamResource> exportExcel() {
        java.util.List<TeacherResponseDto> list = teacherService.getAll(org.springframework.data.domain.Pageable.unpaged()).getContent();
        java.io.ByteArrayInputStream in = teacherService.exportToExcel(list);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=teachers_export.xlsx");
        return ResponseEntity.ok().headers(headers).contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(new org.springframework.core.io.InputStreamResource(in));
    }

    private final TeacherService teacherService;

    @GetMapping
    @Operation(summary = "Lấy danh sách giảng viên có tìm kiếm và phân trang")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Page<TeacherResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String facultyId) {
        Page<TeacherResponseDto> result = teacherService.searchAndFilter(keyword, facultyId, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách giảng viên thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết giảng viên theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<TeacherResponseDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(teacherService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Thêm mới giảng viên")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherResponseDto>> create(@Valid @RequestBody TeacherRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới giảng viên thành công", teacherService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật giảng viên")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TeacherResponseDto>> update(@PathVariable String id, @Valid @RequestBody TeacherRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật giảng viên thành công", teacherService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa giảng viên")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        teacherService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa giảng viên thành công", null));
    }
}



