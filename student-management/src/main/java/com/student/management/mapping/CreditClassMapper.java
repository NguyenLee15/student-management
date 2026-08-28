// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class CreditClassMapper {

    public static CreditClass toEntity(
            CreditClassRequestDto dto,
            Subject subject,
            Teacher teacher,
            Classroom classroom,
            AcademicYear academicYear) {
        return CreditClass.builder()
                .creditClassId(dto.getCreditClassId())
                .creditClassName(dto.getCreditClassName() != null && !dto.getCreditClassName().isBlank() 
                        ? dto.getCreditClassName() 
                        : (subject != null ? subject.getSubjectName() + " - Lớp TC" : "Lớp Tín Chỉ"))
                .subject(subject)
                .teacher(teacher)
                .classroom(classroom)
                .academicYear(academicYear)
                .maxStudents(dto.getMaxStudents() != null ? dto.getMaxStudents() : 50)
                .enrolledCount(0)
                .attendanceWeight(subject != null ? subject.getAttendanceWeight() : null)
                .midtermWeight(subject != null ? subject.getMidtermWeight() : null)
                .finalExamWeight(subject != null ? subject.getFinalExamWeight() : null)
                .locked(false)
                .build();
    }

    public static CreditClassResponseDto toDto(CreditClass creditClass) {
        if (creditClass == null) return null;
        return CreditClassResponseDto.builder()
                .creditClassId(creditClass.getCreditClassId())
                .creditClassName(creditClass.getCreditClassName())
                .subjectId(creditClass.getSubject() != null ? creditClass.getSubject().getSubjectId() : null)
                .subjectName(creditClass.getSubject() != null ? creditClass.getSubject().getSubjectName() : null)
                .credits(creditClass.getSubject() != null ? creditClass.getSubject().getCredits() : null)
                .teacherId(creditClass.getTeacher() != null ? creditClass.getTeacher().getTeacherId() : null)
                .teacherName(creditClass.getTeacher() != null ? creditClass.getTeacher().getFullName() : null)
                .classroomId(creditClass.getClassroom() != null ? creditClass.getClassroom().getRoomId() : null)
                .roomName(creditClass.getClassroom() != null ? creditClass.getClassroom().getRoomName() : null)
                .academicYearId(creditClass.getAcademicYear() != null ? creditClass.getAcademicYear().getAcademicYearId() : null)
                .academicYearName(creditClass.getAcademicYear() != null ? creditClass.getAcademicYear().getAcademicYearName() : null)
                .semesterId(creditClass.getSemester() != null ? creditClass.getSemester().getId() : null)
                .semesterName(creditClass.getSemester() != null ? creditClass.getSemester().getName() : null)
                .semester(creditClass.getSemester() != null ? creditClass.getSemester().getName() : null)
                .maxStudents(creditClass.getMaxStudents())
                .enrolledCount(creditClass.getEnrolledCount() != null ? creditClass.getEnrolledCount() : 0)
                .attendanceWeight(creditClass.getAttendanceWeight())
                .midtermWeight(creditClass.getMidtermWeight())
                .finalExamWeight(creditClass.getFinalExamWeight())
                .locked(creditClass.getLocked())
                .build();
    }

    public static List<CreditClassResponseDto> toDtoList(List<CreditClass> list) {
        if (list == null) return List.of();
        return list.stream().map(CreditClassMapper::toDto).collect(Collectors.toList());
    }
}
