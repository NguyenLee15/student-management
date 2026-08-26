package com.student.management.dto.resp;

import com.student.management.enums.Semester;
import com.student.management.enums.StudyPhase;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TranscriptResponseDto {
    private String studentId;
    private String fullName;
    private String classId;
    private String className;
    private String facultyName;
    private String academicYearName;

    private List<SemesterTranscriptDto> semesterTranscripts;

    // Cumulative Statistics (Áp dụng chính sách Highest Grade Wins)
    private Integer totalCreditsRegistered;
    private Integer totalCreditsEarned;
    private BigDecimal cumulativeGpa10;
    private BigDecimal cumulativeGpa4;
    private String academicStanding; // Xuất sắc, Giỏi, Khá, Trung bình, Yếu

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class SemesterTranscriptDto {
        private Semester semester;
        private String academicYear;
        private StudyPhase studyPhase;
        private List<GradeItemDto> grades;
        private Integer semesterCreditsTaken;
        private Integer semesterCreditsEarned;
        private BigDecimal semesterGpa10;
        private BigDecimal semesterGpa4;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GradeItemDto {
        private Integer gradeId;
        private String subjectId;
        private String subjectName;
        private Integer credits;
        private Integer attemptNumber;
        private BigDecimal scoreScale10;
        private BigDecimal scoreScale4;
        private String letterGrade;
        private Boolean passed;
    }
}
