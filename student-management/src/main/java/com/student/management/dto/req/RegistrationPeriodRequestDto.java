package com.student.management.dto.req;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegistrationPeriodRequestDto {

    @NotBlank(message = "Tên đợt đăng ký là bắt buộc")
    @Size(max = 150, message = "Tên đợt đăng ký không được vượt quá 150 ký tự")
    private String name;

    @NotNull(message = "ID học kỳ là bắt buộc")
    private Long semesterId;

    @NotNull(message = "Thời gian bắt đầu là bắt buộc")
    private LocalDateTime startTime;

    @NotNull(message = "Thời gian kết thúc là bắt buộc")
    private LocalDateTime endTime;

    @Min(value = 1, message = "Số tín chỉ tối đa phải lớn hơn 0")
    @Builder.Default
    private Integer maxCreditsAllowed = 24;

    @Builder.Default
    private Boolean active = true;
}
