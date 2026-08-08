package com.student.management.mapping;

import com.student.management.dto.req.StudentClassRequestDto;
import com.student.management.dto.resp.StudentClassResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.StudentClass;

import java.util.List;
import java.util.stream.Collectors;

public class StudentClassMapper {

    public static StudentClass toEntity(StudentClassRequestDto dto, Faculty faculty) {
        return StudentClass.builder()
                .classId(dto.getClassId())
                .className(dto.getClassName())
                .faculty(faculty)
                .build();
    }

    public static StudentClassResponseDto toDto(StudentClass studentClass) {
        if (studentClass == null) return null;
        return StudentClassResponseDto.builder()
                .classId(studentClass.getClassId())
                .className(studentClass.getClassName())
                .facultyId(studentClass.getFaculty() != null ? studentClass.getFaculty().getFacultyId() : null)
                .facultyName(studentClass.getFaculty() != null ? studentClass.getFaculty().getFacultyName() : null)
                .build();
    }

    public static List<StudentClassResponseDto> toDtoList(List<StudentClass> list) {
        if (list == null) return List.of();
        return list.stream().map(StudentClassMapper::toDto).collect(Collectors.toList());
    }
}

