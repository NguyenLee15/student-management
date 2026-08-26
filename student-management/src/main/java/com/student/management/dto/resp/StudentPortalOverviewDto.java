package com.student.management.dto.resp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentPortalOverviewDto {
    private String studentId;
    private String fullName;
    private String email;
    private String className;
    private String facultyName;
    private String academicYearName;
    private BigDecimal cumulativeGpa10;
    private BigDecimal cumulativeGpa4;
    private Integer totalAccumulatedCredits;
    private Integer requiredCredits;
    private Integer progressPercentage;
    private String academicStanding; // "Xuất sắc", "Giỏi", "Khá", "Trung bình"
    private Integer registeredClassesThisSemester;
    private Integer registeredCreditsThisSemester;
    private BigDecimal tuitionOutstandingBalance;
    private List<StudentTimetableEntryDto> todaySchedule;
}
