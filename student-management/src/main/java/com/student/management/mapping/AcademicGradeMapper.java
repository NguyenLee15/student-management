// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.AcademicGradeRequestDto;
import com.student.management.dto.resp.AcademicGradeResponseDto;
import com.student.management.entity.AcademicGrade;
import com.student.management.entity.Student;
import com.student.management.entity.Subject;

import java.util.List;
import java.util.stream.Collectors;

public class AcademicGradeMapper {

    public static AcademicGrade toEntity(AcademicGradeRequestDto dto, Student student, Subject subject) {
        return AcademicGrade.builder()
                .gradeId(dto.getGradeId())
                .student(student)
                .subject(subject)
                .semester(dto.getSemester())
                .academicYear(dto.getAcademicYear())
                .studyPhase(dto.getStudyPhase())
                .scoreScale10(dto.getScoreScale10())
                .scoreScale4(dto.getScoreScale4())
                .letterGrade(dto.getLetterGrade())
                .attendanceScore(dto.getAttendanceScore())
                .midtermScore(dto.getMidtermScore())
                .finalExamScore(dto.getFinalExamScore())
                .build();
    }

    public static AcademicGradeResponseDto toDto(AcademicGrade grade) {
        if (grade == null) return null;
        return AcademicGradeResponseDto.builder()
                .gradeId(grade.getGradeId())
                .studentId(grade.getStudent() != null ? grade.getStudent().getStudentId() : null)
                .studentName(grade.getStudent() != null ? grade.getStudent().getFullName() : null)
                .subjectId(grade.getSubject() != null ? grade.getSubject().getSubjectId() : null)
                .subjectName(grade.getSubject() != null ? grade.getSubject().getSubjectName() : null)
                .semester(grade.getSemester())
                .academicYear(grade.getAcademicYear())
                .studyPhase(grade.getStudyPhase())
                .scoreScale10(grade.getScoreScale10())
                .scoreScale4(grade.getScoreScale4())
                .letterGrade(grade.getLetterGrade())
                .attendanceScore(grade.getAttendanceScore())
                .midtermScore(grade.getMidtermScore())
                .finalExamScore(grade.getFinalExamScore())
                .build();
    }

    public static List<AcademicGradeResponseDto> toDtoList(List<AcademicGrade> list) {
        if (list == null) return List.of();
        return list.stream().map(AcademicGradeMapper::toDto).collect(Collectors.toList());
    }
}

