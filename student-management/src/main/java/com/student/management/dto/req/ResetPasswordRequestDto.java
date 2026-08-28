// cSpell:disable
package com.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequestDto {
    @NotBlank(message = "Token là bắt buộc")
    private String token;

    @NotBlank(message = "Mật khẩu mới là bắt buộc")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String newPassword;
}

