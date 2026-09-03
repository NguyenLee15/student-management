// cSpell:disable
package com.student.management.dto.req;

import com.student.management.enums.SubjectType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SubjectRequestDto {

    @NotBlank(message = "Mã môn học không được để trống")
    @Size(max = 10, message = "Mã môn học không được vượt quá 10 ký tự")
    private String subjectId;

    @NotBlank(message = "Tên môn học không được để trống")
    @Size(max = 100, message = "Tên môn học không được vượt quá 100 ký tự")
    private String subjectName;

    @NotNull(message = "Loại môn học không được để trống")
    private SubjectType subjectType;

    @NotNull(message = "Học phí mỗi tín chỉ không được để trống")
    @Min(value = 1, message = "Học phí mỗi tín chỉ phải lớn hơn 0")
    private Integer tuitionPerCredit;

    @NotNull(message = "Số tín chỉ không được để trống")
    @Min(value = 1, message = "Số tín chỉ phải lớn hơn 0")
    private Integer credits;

    @NotBlank(message = "Mã khoa không được để trống")
    private String facultyId;

    private String prerequisiteSubjectId;

    private BigDecimal attendanceWeight;

    private BigDecimal midtermWeight;

    private BigDecimal finalExamWeight;
}
