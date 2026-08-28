// cSpell:disable
package com.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TokenRefreshRequestDto {
    @NotBlank(message = "Refresh token là bắt buộc")
    private String refreshToken;
}
