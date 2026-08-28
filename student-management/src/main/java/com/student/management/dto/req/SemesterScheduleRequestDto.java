// cSpell:disable
package com.student.management.dto.req;

import com.student.management.enums.ClassShift;
import com.student.management.enums.Semester;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SemesterScheduleRequestDto {

    private Long scheduleId;

    @NotNull(message = "Mã lớp tín chỉ không được để trống")
    private Long creditClassId;

    @NotBlank(message = "Mã môn học không được để trống")
    private String subjectId;

    @NotBlank(message = "Mã giảng viên không được để trống")
    private String teacherId;

    @NotBlank(message = "Mã phòng không được để trống")
    private String roomId;

    @NotNull(message = "Học kỳ không được để trống")
    private Semester semester;

    @NotBlank(message = "Năm học không được để trống")
    private String academicYear;

    @NotBlank(message = "Thời gian học không được để trống")
    private String studyTime;

    @NotNull(message = "Ca học không được để trống")
    private ClassShift classShift;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate endDate;

    @AssertTrue(message = "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu")
    public boolean isValidDateRange() {
        if (startDate == null || endDate == null) return true;
        return !endDate.isBefore(startDate);
    }
}

