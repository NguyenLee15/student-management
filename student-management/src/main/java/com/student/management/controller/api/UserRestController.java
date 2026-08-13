package com.student.management.controller.api;

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
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users API", description = "Endpoints for managing user accounts and roles")
public class UserRestController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all users with pagination")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Page<UserResponseDto>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<UserResponseDto> result = userService.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(ApiResponse.success("Users fetched successfully", result));
    }

    @GetMapping("/{userName}")
    @Operation(summary = "Get user by username")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDto>> getByUserName(@PathVariable String userName) {
        return userService.findByUserName(userName)
                .map(u -> ResponseEntity.ok(ApiResponse.success(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Create user")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDto>> create(@Valid @RequestBody UserRequestDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User created successfully", userService.create(dto)));
    }

    @DeleteMapping("/{userName}")
    @Operation(summary = "Delete user by username")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String userName) {
        userService.delete(userName);
        return ResponseEntity.ok(ApiResponse.success("User deleted successfully", null));
    }
}

