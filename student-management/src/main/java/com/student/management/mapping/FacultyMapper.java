// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.FacultyRequestDto;
import com.student.management.dto.resp.FacultyResponseDto;
import com.student.management.entity.Faculty;

import java.util.List;
import java.util.stream.Collectors;

public class FacultyMapper {

    public static Faculty toEntity(FacultyRequestDto dto) {
        return Faculty.builder()
                .facultyId(dto.getFacultyId())
                .facultyName(dto.getFacultyName())
                .build();
    }

    public static FacultyResponseDto toDto(Faculty faculty) {
        if (faculty == null) return null;
        return FacultyResponseDto.builder()
                .facultyId(faculty.getFacultyId())
                .facultyName(faculty.getFacultyName())
                .build();
    }

    public static List<FacultyResponseDto> toDtoList(List<Faculty> faculties) {
        if (faculties == null) return List.of();
        return faculties.stream().map(FacultyMapper::toDto).collect(Collectors.toList());
    }
}

