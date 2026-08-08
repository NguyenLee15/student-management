package com.student.management.controller.api;

import com.student.management.config.JwtTokenProvider;
import com.student.management.dto.req.LoginRequestDto;
import com.student.management.dto.req.UserRequestDto;
import com.student.management.dto.resp.ApiResponse;
import com.student.management.dto.resp.JwtResponseDto;
import com.student.management.dto.resp.UserResponseDto;
import com.student.management.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication API", description = "Đăng nhập, Đăng ký và Xác thực JWT")
public class AuthRestController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập lấy JWT Bearer Token")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(@Valid @RequestBody LoginRequestDto loginRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUserName(), loginRequest.getPassword())
        );

        UserResponseDto user = userService.getByUserName(loginRequest.getUserName());

        String token = jwtTokenProvider.generateToken(user.getUserName(), user.getRole().name());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("token", token);
        responseData.put("tokenType", "Bearer");
        responseData.put("userName", user.getUserName());
        responseData.put("role", user.getRole());
        responseData.put("expiresInMs", 86400000);

        return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", responseData));
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản người dùng mới")
    public ResponseEntity<ApiResponse<UserResponseDto>> register(@Valid @RequestBody UserRequestDto dto) {
        UserResponseDto createdUser = userService.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Đăng ký tài khoản thành công", createdUser));
    }
}

