// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.RegistrationPeriodRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.RegistrationPeriodResponseDto;
import com.student.management.service.RegistrationPeriodService;
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
@RequestMapping("/api/v1/registration-periods")
@RequiredArgsConstructor
@Tag(name = "API Đợt Đăng Ký Học Phần", description = "Quản lý các đợt đăng ký tín chỉ học phần")
public class RegistrationPeriodRestController {

    private final RegistrationPeriodService registrationPeriodService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả các đợt đăng ký tín chỉ")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<RegistrationPeriodResponseDto>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách đợt đăng ký thành công", registrationPeriodService.getAllRegistrationPeriods()));
    }

    @GetMapping("/active")
    @Operation(summary = "Lấy danh sách các đợt đăng ký tín chỉ đang mở")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<List<RegistrationPeriodResponseDto>>> getActivePeriods() {
        return ResponseEntity.ok(ApiResponse.success("Lấy các đợt đăng ký đang mở thành công", registrationPeriodService.getCurrentlyActivePeriods()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết đợt đăng ký tín chỉ theo ID")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<ApiResponse<RegistrationPeriodResponseDto>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(registrationPeriodService.getRegistrationPeriodById(id)));
    }

    @PostMapping
    @Operation(summary = "Tạo mới đợt đăng ký tín chỉ")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationPeriodResponseDto>> create(@Valid @RequestBody RegistrationPeriodRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Tạo đợt đăng ký tín chỉ thành công", registrationPeriodService.createRegistrationPeriod(dto)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật đợt đăng ký tín chỉ")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RegistrationPeriodResponseDto>> update(@PathVariable Long id, @Valid @RequestBody RegistrationPeriodRequestDto dto) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật đợt đăng ký tín chỉ thành công", registrationPeriodService.updateRegistrationPeriod(id, dto)));
    }

    @PatchMapping("/{id}/toggle-active")
    @Operation(summary = "Bật/Tắt trạng thái hoạt động của đợt đăng ký")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> toggleActive(@PathVariable Long id) {
        registrationPeriodService.toggleActive(id);
        return ResponseEntity.ok(ApiResponse.success("Chuyển đổi trạng thái đợt đăng ký thành công", null));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa đợt đăng ký tín chỉ (Soft delete)")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        registrationPeriodService.deleteRegistrationPeriod(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa đợt đăng ký tín chỉ thành công", null));
    }
}
