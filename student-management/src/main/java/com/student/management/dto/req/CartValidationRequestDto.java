package com.student.management.dto.req;

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
public class CartValidationRequestDto {
    @NotEmpty(message = "Danh sách lớp học phần trong giỏ không được để trống")
    private List<Long> creditClassIds;
}
