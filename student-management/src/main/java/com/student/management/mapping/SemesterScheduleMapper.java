// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.SemesterScheduleRequestDto;
import com.student.management.dto.resp.SemesterScheduleResponseDto;
import com.student.management.entity.*;

import java.util.List;
import java.util.stream.Collectors;

public class SemesterScheduleMapper {

    public static SemesterSchedule toEntity(SemesterScheduleRequestDto dto, CreditClass creditClass, Subject subject, Teacher teacher, Classroom classroom) {
        return SemesterSchedule.builder()
                .scheduleId(dto.getScheduleId())
                .creditClass(creditClass)
                .subject(subject)
                .teacher(teacher)
                .classroom(classroom)
                .semester(dto.getSemester())
                .academicYear(dto.getAcademicYear())
                .studyTime(dto.getStudyTime())
                .classShift(dto.getClassShift())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .build();
    }

    public static SemesterScheduleResponseDto toDto(SemesterSchedule schedule) {
        if (schedule == null) return null;
        return SemesterScheduleResponseDto.builder()
                .scheduleId(schedule.getScheduleId())
                .creditClassId(schedule.getCreditClass() != null ? schedule.getCreditClass().getCreditClassId() : null)
                .creditClassName(schedule.getCreditClass() != null ? schedule.getCreditClass().getCreditClassName() : null)
                .subjectId(schedule.getSubject() != null ? schedule.getSubject().getSubjectId() : null)
                .subjectName(schedule.getSubject() != null ? schedule.getSubject().getSubjectName() : null)
                .teacherId(schedule.getTeacher() != null ? schedule.getTeacher().getTeacherId() : null)
                .teacherName(schedule.getTeacher() != null ? schedule.getTeacher().getFullName() : null)
                .roomId(schedule.getClassroom() != null ? schedule.getClassroom().getRoomId() : null)
                .roomName(schedule.getClassroom() != null ? schedule.getClassroom().getRoomName() : null)
                .semester(schedule.getSemester())
                .academicYear(schedule.getAcademicYear())
                .studyTime(schedule.getStudyTime())
                .classShift(schedule.getClassShift())
                .startDate(schedule.getStartDate())
                .endDate(schedule.getEndDate())
                .build();
    }

    public static List<SemesterScheduleResponseDto> toDtoList(List<SemesterSchedule> list) {
        if (list == null) return List.of();
        return list.stream().map(SemesterScheduleMapper::toDto).collect(Collectors.toList());
    }
}

