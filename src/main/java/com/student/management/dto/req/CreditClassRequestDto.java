package com.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CreditClassRequestDto {
    private Long creditClassId;

    @NotBlank(message = "Credit class name cannot be blank")
    private String creditClassName;

    @NotBlank(message = "Subject ID cannot be blank")
    private String subjectId;
}

