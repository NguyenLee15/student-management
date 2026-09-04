// cSpell:disable
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
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "API Xác Thực & Đăng Nhập", description = "Đăng nhập, Đăng ký và Xác thực JWT")
public class AuthRestController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập lấy JWT Bearer Token & Refresh Token (Cookie & Body)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @Valid @RequestBody LoginRequestDto loginRequest,
            HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword())
        );

        UserResponseDto user = userService.getByUserName(loginRequest.getUserName());

        String token = jwtTokenProvider.generateToken(user.getUserName(), user.getRole().name(), user.getStudentId());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUserName());

        // Set Secure HttpOnly Cookie for Refresh Token
        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(7 * 24 * 3600)
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);
        
        responseData.put("tokenType", "Bearer");
        responseData.put("userName", user.getUserName());
        responseData.put("role", user.getRole());
        responseData.put("studentId", user.getStudentId());
        responseData.put("teacherId", user.getTeacherId());
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
    @Operation(summary = "Làm mới Access Token với cơ chế Refresh Token Rotation (Hỗ trợ Cookie & Request Body)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> refreshToken(
            @RequestBody(required = false) TokenRefreshRequestDto request,
            @CookieValue(name = "refreshToken", required = false) String cookieRefreshToken,
            HttpServletResponse response) {
        String tokenStr = (request != null && StringUtils.hasText(request.getRefreshToken()))
                ? request.getRefreshToken()
                : cookieRefreshToken;

        if (!StringUtils.hasText(tokenStr)) {
            throw new IllegalArgumentException("Refresh token không được để trống trong Cookie hoặc Request Body!");
        }

        RefreshToken oldToken = refreshTokenService.findByToken(tokenStr)
                .map(refreshTokenService::verifyExpiration)
                .orElseThrow(() -> new IllegalArgumentException("Refresh token không hợp lệ hoặc đã hết hạn!"));

        UserResponseDto user = userService.getByUserName(oldToken.getUserName());
        
        // Refresh token rotation: Revoke old token and create new one
        RefreshToken newRefreshToken = refreshTokenService.createRefreshToken(user.getUserName());
        String newAccessToken = jwtTokenProvider.generateToken(user.getUserName(), user.getRole().name(), user.getStudentId());

        // Update Cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", newRefreshToken.getToken())
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(7 * 24 * 3600)
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", newAccessToken);
        
        responseData.put("tokenType", "Bearer");
        responseData.put("userName", user.getUserName());
        responseData.put("role", user.getRole());
        responseData.put("studentId", user.getStudentId());
        responseData.put("teacherId", user.getTeacherId());
        responseData.put("expiresInMs", 900000);

        return ResponseEntity.ok(ApiResponse.success("Làm mới token thành công", responseData));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Quên mật khẩu (gửi email reset)")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody com.student.management.dto.req.ForgotPasswordRequestDto dto,
            @RequestHeader(value = "Origin", required = false) String origin) {
            
        String appUrl = (origin != null && !origin.isEmpty()) ? origin : "http://localhost:5173";
        userService.forgotPassword(dto.getEmail(), appUrl);
        
        return ResponseEntity.ok(ApiResponse.success("Nếu email tồn tại, link reset đã được gửi", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Đặt lại mật khẩu bằng token")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody com.student.management.dto.req.ResetPasswordRequestDto dto) {
            
        userService.resetPassword(dto.getToken(), dto.getNewPassword());
        return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công", null));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất và thu hồi Refresh Token (Cookie & Body)")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestBody(required = false) TokenRefreshRequestDto request,
            @CookieValue(name = "refreshToken", required = false) String cookieRefreshToken,
            HttpServletResponse response) {
        String tokenStr = (request != null && StringUtils.hasText(request.getRefreshToken()))
                ? request.getRefreshToken()
                : cookieRefreshToken;

        if (StringUtils.hasText(tokenStr)) {
            refreshTokenService.deleteByToken(tokenStr);
        }

        // Clear cookie
        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/api/v1/auth")
                .maxAge(0)
                .sameSite("None")
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công", null));
    }
}
