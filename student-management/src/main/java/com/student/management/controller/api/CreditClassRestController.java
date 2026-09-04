// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.security.SecurityService;
import com.student.management.service.CreditClassService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import com.student.management.dto.resp.StudentResponseDto;
import com.student.management.service.StudentService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/credit-classes")
@RequiredArgsConstructor
@Tag(name = "API Quản Lý Lớp Tín Chỉ", description = "Quản lý lớp tín chỉ và đăng ký học phần đồng thời")
public class CreditClassRestController {

    private final CreditClassService creditClassService;
    private final StudentService studentService;
    private final SecurityService securityService;

    @GetMapping
    @Operation(summary = "Lấy danh sách lớp tín chỉ có phân trang và tìm kiếm")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Object>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean unpaged,
            @RequestParam(required = false) String teacherId) {

        if (teacherId != null && !teacherId.isBlank()) {
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp tín chỉ theo giảng viên thành công", creditClassService.getByTeacherId(teacherId)));
        }

        if (unpaged) {
            return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp tín chỉ thành công", creditClassService.getAll()));
        }

        Page<CreditClassResponseDto> result = creditClassService.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách lớp tín chỉ thành công", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin lớp tín chỉ theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(creditClassService.getById(id)));
    }

    @PostMapping
    @Operation(summary = "Mở lớp tín chỉ mới")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> create(@Valid @RequestBody CreditClassRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới lớp tín chỉ thành công", creditClassService.create(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật lớp tín chỉ")
    @PreAuthorize("hasRole('ADMIN') or (hasRole('TEACHER') and @securityService.isClassInstructor(#id))")
    public ResponseEntity<ApiResponse<CreditClassResponseDto>> update(@PathVariable Long id, @Valid @RequestBody CreditClassRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật lớp tín chỉ thành công", creditClassService.update(id, dto)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Hủy lớp tín chỉ")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        creditClassService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa lớp tín chỉ thành công", null));
    }

    @PostMapping("/{classId}/students/{studentId}")
    @Operation(summary = "Đăng ký học phần (Student enrollment with Optimistic Locking)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Void>> addStudent(@PathVariable Long classId, @PathVariable String studentId) {
        if (securityService.isStudentRole() && !studentId.equals(securityService.getCurrentStudentId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "Không có quyền thao tác enrollment cho sinh viên khác.");
        }
        creditClassService.addStudentToCreditClass(classId, studentId);
        return ResponseEntity.ok(ApiResponse.success("Đăng ký lớp tín chỉ thành công", null));
    }

    @DeleteMapping("/{classId}/students/{studentId}")
    @Operation(summary = "Hủy đăng ký học phần (Student unenrollment)")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<Void>> removeStudent(@PathVariable Long classId, @PathVariable String studentId) {
        if (securityService.isStudentRole() && !studentId.equals(securityService.getCurrentStudentId())) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED, "Không có quyền thao tác enrollment cho sinh viên khác.");
        }
        creditClassService.removeStudentFromCreditClass(classId, studentId);
        return ResponseEntity.ok(ApiResponse.success("Hủy đăng ký lớp tín chỉ thành công", null));
    }

    @GetMapping("/{id}/students")
    @Operation(summary = "Lấy danh sách sinh viên đăng ký theo lớp tín chỉ")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<StudentResponseDto>>> getStudentsByCreditClass(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách sinh viên theo lớp tín chỉ thành công", studentService.getStudentsByCreditClassId(id)));
    }
}
