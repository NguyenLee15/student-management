// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.SemesterScheduleRequestDto;
import com.student.management.dto.req.SemesterScheduleUpdateDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.SemesterScheduleResponseDto;
import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import com.student.management.service.SemesterScheduleService;
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
@RequestMapping("/api/v1/semester-schedules")
@RequiredArgsConstructor
@Tag(name = "Semester Schedules API", description = "Quản lý thời khóa biểu và lịch trình học kỳ")
public class SemesterScheduleRestController {

    private final SemesterScheduleService semesterScheduleService;

    @GetMapping
    @Operation(summary = "Lấy danh sách lịch học có lọc và phân trang")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Page<SemesterScheduleResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long creditClassId,
            @RequestParam(required = false) String subjectId,
            @RequestParam(required = false) Semester semester,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) String teacherId,
            @RequestParam(required = false) String roomId,
            @RequestParam(required = false) ClassShift classShift) {
        Page<SemesterScheduleResponseDto> result = semesterScheduleService.searchAndFilter(
                creditClassId, subjectId, semester, academicYear, teacherId, roomId, classShift, PageRequest.of(page, size)
        );
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lịch trình thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết lịch học theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<SemesterScheduleResponseDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(semesterScheduleService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo lịch học mới")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<SemesterScheduleResponseDto>> create(@Valid @RequestBody SemesterScheduleRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới lịch trình thành công", semesterScheduleService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật lịch học")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<SemesterScheduleResponseDto>> update(@PathVariable Long id, @Valid @RequestBody SemesterScheduleUpdateDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lịch trình thành công", semesterScheduleService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa lịch học")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        semesterScheduleService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lịch trình thành công", null));
    }
}
