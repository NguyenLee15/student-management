package com.student.management.controller.api;

import com.student.management.config.JwtTokenProvider;
import com.student.management.dto.req.LoginRequestDto;
import com.student.management.dto.req.TokenRefreshRequestDto;
import com.student.management.dto.req.UserRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.UserResponseDto;
import com.student.management.entity.RefreshToken;
import com.student.management.service.RefreshTokenService;
import com.student.management.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication API", description = "Đăng nhập, Đăng ký và Xác thực JWT")
public class AuthRestController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập lấy JWT Bearer Token & Refresh Token")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword())
        );

        UserResponseDto user = userService.getByUserName(loginRequest.getUserName());

        String token = jwtTokenProvider.generateToken(user.getUserName(), user.getRole().name(), user.getStudentId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUserName());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);
        responseData.put("refreshToken", refreshToken.getToken());
        responseData.put("tokenType", "Bearer");
        responseData.put("userName", user.getUserName());
        responseData.put("role", user.getRole());
        responseData.put("studentId", user.getStudentId());
        responseData.put("expiresInMs", 900000); // 15 mins

        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", responseData));
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản người dùng mới (Admin)")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@Valid @RequestBody UserRequestDto dto) {
        UserResponseDto createdUser = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký tài khoản thành công", createdUser));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Làm mới Access Token với cơ chế Refresh Token Rotation")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshToken(@Valid @RequestBody TokenRefreshRequestDto request) {
        String requestRefreshToken = request.getRefreshToken();

        RefreshToken oldToken = refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token không hợp lệ hoặc đã hết hạn!"));

        UserResponseDto user = userService.getByUserName(oldToken.getUserName());
        
        // Refresh token rotation: Revoke old token and create new one
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getUserName());
        String newAccessToken = jwtTokenProvider.generateToken(user.getUserName(), user.getRole().name(), user.getStudentId());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", newAccessToken);
        responseData.put("refreshToken", newRefreshToken.getToken());
        responseData.put("tokenType", "Bearer");
        responseData.put("userName", user.getUserName());
        responseData.put("role", user.getRole());
        responseData.put("studentId", user.getStudentId());
        responseData.put("expiresInMs", 900000);

        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", responseData));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất và thu hồi Refresh Token")
    public ResponseEntity<ApiResponse<Void>> logout(@Valid @RequestBody TokenRefreshRequestDto request) {
        refreshTokenService.findByToken(request.getRefreshToken())
                .ifPresent(token -> refreshTokenService.revokeByUserName(token.getUserName()));
        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }
}
