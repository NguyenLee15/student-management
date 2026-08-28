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
public class FacultyRequestDto {

    @NotBlank(message = "Mã khoa không được để trống")
    @Size(max = 10, message = "Mã khoa không được vượt quá 10 ký tự")
    private String facultyId;

    @NotBlank(message = "Tên khoa không được để trống")
    @Size(max = 100, message = "Tên khoa không được vượt quá 100 ký tự")
    private String facultyName;
}

