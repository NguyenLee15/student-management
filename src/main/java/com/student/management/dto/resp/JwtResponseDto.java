package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDto {
    private String token;
    @Builder.Default
    private String tokenType = "Bearer";
    private String userName;
    private String role;
    @Builder.Default
    private long expiresInMs = 86400000;
}

