package com.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationBatchRequestDto {

    @NotEmpty(message = "Danh sách lớp học phần đăng ký không được để trống")
    private List<Long> creditClassIds;

    @NotBlank(message = "Idempotency key không được để trống")
    private String idempotencyKey;
}
