// cSpell:disable
package com.student.management.dto.req;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequestDto {
    @NotBlank(message = "Email là bắt buộc")
    @Email(message = "Định dạng email không hợp lệ")
    private String email;
}

