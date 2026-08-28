// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.TeacherRequestDto;
import com.student.management.dto.resp.TeacherResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.Teacher;

import java.util.List;
import java.util.stream.Collectors;

public class TeacherMapper {

    public static Teacher toEntity(TeacherRequestDto dto, Faculty faculty) {
        return Teacher.builder()
                .teacherId(dto.getTeacherId())
                .fullName(dto.getFullName())
                .email(dto.getEmail())
                .faculty(faculty)
                .build();
    }

    public static TeacherResponseDto toDto(Teacher teacher) {
        if (teacher == null) return null;
        return TeacherResponseDto.builder()
                .teacherId(teacher.getTeacherId())
                .fullName(teacher.getFullName())
                .email(teacher.getEmail())
                .facultyId(teacher.getFaculty() != null ? teacher.getFaculty().getFacultyId() : null)
                .facultyName(teacher.getFaculty() != null ? teacher.getFaculty().getFacultyName() : null)
                .build();
    }

    public static List<TeacherResponseDto> toDtoList(List<Teacher> teachers) {
        if (teachers == null) return List.of();
        return teachers.stream().map(TeacherMapper::toDto).collect(Collectors.toList());
    }
}

