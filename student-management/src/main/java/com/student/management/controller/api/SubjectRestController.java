// cSpell:disable
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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
@Tag(name = "Subjects API", description = "Quản lý môn học / học phần")
public class SubjectRestController {

    @GetMapping("/export")
    @Operation(summary = "Xuất danh sách môn học ra file Excel (.xlsx)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<org.springframework.core.io.InputStreamResource> exportExcel() {
        org.springframework.data.domain.Page<SubjectResponseDto> list = subjectService.getAll(0, Integer.MAX_VALUE);
        java.io.ByteArrayInputStream in = subjectService.exportToExcel(list);
        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=subjects_export.xlsx");
        return ResponseEntity.ok().headers(headers).contentType(org.springframework.http.MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")).body(new org.springframework.core.io.InputStreamResource(in));
    }

    private final SubjectService subjectService;

    @GetMapping
    @Operation(summary = "Lấy danh sách môn học có phân trang")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Page<SubjectResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<SubjectResponseDto> result = subjectService.getAll(page, size);
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách môn học thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết môn học theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<SubjectResponseDto>> getById(@PathVariable String id) {
        return subjectService.getById(id)
                .map(s -> ResponseEntity.ok(ApiResponse.success(s)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Thêm mới môn học")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubjectResponseDto>> create(@Valid @RequestBody SubjectRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới môn học thành công", subjectService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật môn học")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<SubjectResponseDto>> update(@PathVariable String id, @Valid @RequestBody SubjectRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật môn học thành công", subjectService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa môn học")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        subjectService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa môn học thành công", null));
    }
}



