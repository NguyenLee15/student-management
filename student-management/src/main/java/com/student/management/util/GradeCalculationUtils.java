// cSpell:disable
package com.student.management.util;

import com.student.management.dto.resp.TranscriptResponseDto;
import com.student.management.entity.AcademicGrade;
import com.student.management.entity.Student;
import com.student.management.entity.Subject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

public class GradeCalculationUtils {

    public static String determineLetterGrade(BigDecimal score10) {
        if (score10 == null) return "F";
        double s = score10.doubleValue();
        if (s >= 8.5) return "A";
        if (s >= 8.0) return "B+";
        if (s >= 7.0) return "B";
        if (s >= 6.5) return "C+";
        if (s >= 5.5) return "C";
        if (s >= 5.0) return "D+";
        if (s >= 4.0) return "D";
        return "F";
    }

    public static BigDecimal determineScoreScale4(String letterGrade) {
        if (letterGrade == null) return BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        return switch (letterGrade.toUpperCase().trim()) {
            case "A" -> BigDecimal.valueOf(4.0).setScale(2, RoundingMode.HALF_UP);
            case "B+" -> BigDecimal.valueOf(3.5).setScale(2, RoundingMode.HALF_UP);
            case "B" -> BigDecimal.valueOf(3.0).setScale(2, RoundingMode.HALF_UP);
            case "C+" -> BigDecimal.valueOf(2.5).setScale(2, RoundingMode.HALF_UP);
            case "C" -> BigDecimal.valueOf(2.0).setScale(2, RoundingMode.HALF_UP);
            case "D+" -> BigDecimal.valueOf(1.5).setScale(2, RoundingMode.HALF_UP);
            case "D" -> BigDecimal.valueOf(1.0).setScale(2, RoundingMode.HALF_UP);
            default -> BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        };
    }

    public static String determineAcademicStanding(BigDecimal gpa4) {
        if (gpa4 == null) return "Chưa xếp loại";
        double gpa = gpa4.doubleValue();
        if (gpa >= 3.60) return "Xuất sắc";
        if (gpa >= 3.20) return "Giỏi";
        if (gpa >= 2.50) return "Khá";
        if (gpa >= 2.00) return "Trung bình";
        return "Yếu (Cảnh báo)";
    }

    public static TranscriptResponseDto buildTranscript(Student student, List<AcademicGrade> allGrades) {
        if (student == null) {
            return null;
        }

        List<AcademicGrade> safeGrades = (allGrades != null) ? allGrades : List.of();

        // Group by Semester + AcademicYear + StudyPhase
        Map<String, List<AcademicGrade>> grouped = safeGrades.stream()
                .filter(Objects::nonNull)
                .collect(Collectors.groupingBy(g -> {
                    String y = g.getAcademicYear() != null ? g.getAcademicYear() : "N/A";
                    String s = g.getSemester() != null ? g.getSemester().name() : "SEMESTER_1";
                    String p = g.getStudyPhase() != null ? g.getStudyPhase().name() : "PHASE_1";
                    return y + "_" + s + "_" + p;
                }, LinkedHashMap::new, Collectors.toList()));

        List<TranscriptResponseDto.SemesterTranscriptDto> semesterList = new ArrayList<>();

        for (Map.Entry<String, List<AcademicGrade>> entry : grouped.entrySet()) {
            List<AcademicGrade> sGrades = entry.getValue();
            if (sGrades.isEmpty()) continue;

            AcademicGrade first = sGrades.get(0);
            int semTaken = 0;
            int semEarned = 0;
            BigDecimal totalWeightedScore10 = BigDecimal.ZERO;
            BigDecimal totalWeightedScore4 = BigDecimal.ZERO;

            List<TranscriptResponseDto.GradeItemDto> items = new ArrayList<>();
            for (AcademicGrade g : sGrades) {
                Subject subj = g.getSubject();
                int credits = (subj != null && subj.getCredits() != null) ? subj.getCredits() : 3;
                BigDecimal s10 = g.getScoreScale10() != null ? g.getScoreScale10() : BigDecimal.ZERO;
                BigDecimal s4 = g.getScoreScale4() != null ? g.getScoreScale4() : determineScoreScale4(g.getLetterGrade());
                boolean passed = s4.compareTo(BigDecimal.ZERO) > 0 && !"F".equalsIgnoreCase(g.getLetterGrade());

                semTaken += credits;
                if (passed) {
                    semEarned += credits;
                }

                totalWeightedScore10 = totalWeightedScore10.add(s10.multiply(BigDecimal.valueOf(credits)));
                totalWeightedScore4 = totalWeightedScore4.add(s4.multiply(BigDecimal.valueOf(credits)));

                items.add(TranscriptResponseDto.GradeItemDto.builder()
                        .gradeId(g.getGradeId())
                        .subjectId(subj != null ? subj.getSubjectId() : "")
                        .subjectName(subj != null ? subj.getSubjectName() : "")
                        .credits(credits)
                        .attemptNumber(g.getAttemptNumber() != null ? g.getAttemptNumber() : 1)
                        .scoreScale10(s10)
                        .scoreScale4(s4)
                        .letterGrade(g.getLetterGrade())
                        .passed(passed)
                        .build());
            }

            BigDecimal semGpa10 = semTaken > 0 
                    ? totalWeightedScore10.divide(BigDecimal.valueOf(semTaken), 2, RoundingMode.HALF_UP) 
                    : BigDecimal.ZERO;
            BigDecimal semGpa4 = semTaken > 0 
                    ? totalWeightedScore4.divide(BigDecimal.valueOf(semTaken), 2, RoundingMode.HALF_UP) 
                    : BigDecimal.ZERO;

            semesterList.add(TranscriptResponseDto.SemesterTranscriptDto.builder()
                    .semester(first.getSemester())
                    .academicYear(first.getAcademicYear())
                    .studyPhase(first.getStudyPhase())
                    .grades(items)
                    .semesterCreditsTaken(semTaken)
                    .semesterCreditsEarned(semEarned)
                    .semesterGpa10(semGpa10)
                    .semesterGpa4(semGpa4)
                    .build());
        }

        // Calculate Cumulative Statistics applying "Highest Grade Wins" policy
        // Group all attempts by subjectId
        Map<String, List<AcademicGrade>> subjectAttempts = safeGrades.stream()
                .filter(g -> g != null && g.getSubject() != null && g.getSubject().getSubjectId() != null)
                .collect(Collectors.groupingBy(g -> g.getSubject().getSubjectId()));

        int totalCumulativeEarned = 0;
        int totalUniqueCredits = 0;
        BigDecimal cumWeighted10 = BigDecimal.ZERO;
        BigDecimal cumWeighted4 = BigDecimal.ZERO;

        for (Map.Entry<String, List<AcademicGrade>> subEntry : subjectAttempts.entrySet()) {
            List<AcademicGrade> attempts = subEntry.getValue();
            if (attempts.isEmpty()) continue;

            // Pick attempt with highest scale 4 score
            AcademicGrade bestAttempt = attempts.stream()
                    .max(Comparator.comparing(g -> g.getScoreScale4() != null ? g.getScoreScale4() : BigDecimal.ZERO))
                    .orElse(attempts.get(0));

            Subject subj = bestAttempt.getSubject();
            int credits = (subj != null && subj.getCredits() != null) ? subj.getCredits() : 3;
            BigDecimal bestS4 = bestAttempt.getScoreScale4() != null ? bestAttempt.getScoreScale4() : BigDecimal.ZERO;
            BigDecimal bestS10 = bestAttempt.getScoreScale10() != null ? bestAttempt.getScoreScale10() : BigDecimal.ZERO;
            boolean passed = bestS4.compareTo(BigDecimal.ZERO) > 0 && !"F".equalsIgnoreCase(bestAttempt.getLetterGrade());

            totalUniqueCredits += credits;
            if (passed) {
                totalCumulativeEarned += credits;
            }

            cumWeighted10 = cumWeighted10.add(bestS10.multiply(BigDecimal.valueOf(credits)));
            cumWeighted4 = cumWeighted4.add(bestS4.multiply(BigDecimal.valueOf(credits)));
        }

        int totalCreditsRegistered = safeGrades.stream()
                .mapToInt(g -> g != null && g.getSubject() != null && g.getSubject().getCredits() != null ? g.getSubject().getCredits() : 3)
                .sum();

        BigDecimal cumulativeGpa10 = totalUniqueCredits > 0 
                ? cumWeighted10.divide(BigDecimal.valueOf(totalUniqueCredits), 2, RoundingMode.HALF_UP) 
                : BigDecimal.ZERO;
        BigDecimal cumulativeGpa4 = totalUniqueCredits > 0 
                ? cumWeighted4.divide(BigDecimal.valueOf(totalUniqueCredits), 2, RoundingMode.HALF_UP) 
                : BigDecimal.ZERO;

        return TranscriptResponseDto.builder()
                .studentId(student.getStudentId())
                .fullName(student.getFullName())
                .classId(student.getStudentClass() != null ? student.getStudentClass().getClassId() : "")
                .className(student.getStudentClass() != null ? student.getStudentClass().getClassName() : "")
                .facultyName(student.getStudentClass() != null && student.getStudentClass().getFaculty() != null 
                        ? student.getStudentClass().getFaculty().getFacultyName() : "")
                .academicYearName(student.getAcademicYear() != null ? student.getAcademicYear().getAcademicYearName() : "")
                .semesterTranscripts(semesterList)
                .totalCreditsRegistered(totalCreditsRegistered)
                .totalCreditsEarned(totalCumulativeEarned)
                .cumulativeGpa10(cumulativeGpa10)
                .cumulativeGpa4(cumulativeGpa4)
                .academicStanding(determineAcademicStanding(cumulativeGpa4))
                .build();
    }
}
