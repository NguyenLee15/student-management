// cSpell:disable
package com.student.management.controller.api;

import com.student.management.dto.req.ChangePasswordDto;
import com.student.management.dto.req.UserRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.UserResponseDto;
import com.student.management.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users API", description = "Quản lý tài khoản người dùng, hồ sơ và phân quyền")
public class UserRestController {

    private final UserService userService;

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<UserResponseDto>> getCurrentUser(Authentication authentication) {
        String currentUsername = authentication.getName();
        UserResponseDto user = userService.getByUserName(currentUsername);
        return ResponseEntity.ok(ApiResponse.success("Thông tin tài khoản", user));
    }

    @PutMapping("/change-password")
    @Operation(summary = "Đổi mật khẩu tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordDto dto) {
        String currentUsername = authentication.getName();
        userService.changePassword(currentUsername, dto);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công", null));
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách người dùng có phân trang")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserResponseDto> result = userService.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Lấy danh sách người dùng thành công", result));
    }

    @GetMapping("/{userName}")
    @Operation(summary = "Lấy chi tiết người dùng theo tên đăng nhập")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDto>> getByUserName(@PathVariable String userName) {
        return userService.findByUserName(userName)
                .map(u -> ResponseEntity.ok(ApiResponse.success(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Tạo người dùng mới")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDto>> create(@Valid @RequestBody UserRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Thêm mới người dùng thành công", userService.create(dto)));
    }

    @DeleteMapping("/{userName}")
    @Operation(summary = "Xóa người dùng theo tên đăng nhập")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String userName) {
        userService.delete(userName);
        return ResponseEntity.ok(ApiResponse.success("Xóa người dùng thành công", null));
    }
}
