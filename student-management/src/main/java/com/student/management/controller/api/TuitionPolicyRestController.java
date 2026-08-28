// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.TuitionPolicyRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.TuitionPolicyResponseDto;
import com.student.management.service.TuitionPolicyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tuition-policies")
@RequiredArgsConstructor
@Tag(name = "API Chính Sách Học Phí", description = "Quản lý định mức biểu phí học phí theo tín chỉ")
public class TuitionPolicyRestController {

    private final TuitionPolicyService tuitionPolicyService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả các biểu phí học phí")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<TuitionPolicyResponseDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách biểu phí học phí thành công", tuitionPolicyService.getAllPolicies()));
    }

    @GetMapping("/semester/{semesterId}")
    @Operation(summary = "Lấy danh sách biểu phí học phí theo học kỳ")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<TuitionPolicyResponseDto>>> getBySemester(@PathVariable Long semesterId) {
        return ResponseEntity.ok(ApiResponse.success("Lấy biểu phí học phí theo học kỳ thành công", tuitionPolicyService.getPoliciesBySemester(semesterId)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới biểu phí học phí")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TuitionPolicyResponseDto>> create(@Valid @RequestBody TuitionPolicyRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo biểu phí học phí thành công", tuitionPolicyService.createPolicy(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật biểu phí học phí")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<TuitionPolicyResponseDto>> update(@PathVariable Long id, @Valid @RequestBody TuitionPolicyRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật biểu phí học phí thành công", tuitionPolicyService.updatePolicy(id, dto)));
    }

    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Bật/Tắt trạng thái hoạt động của biểu phí")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleActive(@PathVariable Long id) {
        tuitionPolicyService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success("Chuyển đổi trạng thái biểu phí thành công", null));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa biểu phí học phí (Soft delete)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        tuitionPolicyService.deletePolicy(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa biểu phí học phí thành công", null));
    }
}
