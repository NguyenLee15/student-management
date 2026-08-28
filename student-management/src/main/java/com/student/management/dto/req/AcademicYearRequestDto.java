// cSpell:disable
package com.student.management.dto.req;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicYearRequestDto {

    @NotBlank(message = "Mã năm học không được để trống")
    @Size(max = 10, message = "Mã năm học không được vượt quá 10 ký tự")
    private String academicYearId;

    @NotBlank(message = "Academic year name không được để trống")
    @Size(max = 50, message = "Academic year name không được vượt quá 50 ký tự")
    private String academicYearName;
}

