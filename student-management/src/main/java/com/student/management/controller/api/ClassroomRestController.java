// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.ClassroomRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.ClassroomResponseDto;
import com.student.management.enums.Building;
import com.student.management.service.ClassroomService;
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
@RequestMapping("/api/v1/classrooms")
@RequiredArgsConstructor
@Tag(name = "Classrooms API", description = "Quản lý phòng học và giảng đường")
public class ClassroomRestController {

    private final ClassroomService classroomService;

    @GetMapping
    @Operation(summary = "Get all classrooms with pagination and filters")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Page<ClassroomResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Building building) {
        Page<ClassroomResponseDto> result = classroomService.searchAndFilter(keyword, building, PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách phòng học thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get classroom by ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<ClassroomResponseDto>> getById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(classroomService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Create classroom")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClassroomResponseDto>> create(@Valid @RequestBody ClassroomRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới phòng học thành công", classroomService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update classroom")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ClassroomResponseDto>> update(@PathVariable String id, @Valid @RequestBody ClassroomRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật phòng học thành công", classroomService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete classroom")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        classroomService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa phòng học thành công", null));
    }
}

