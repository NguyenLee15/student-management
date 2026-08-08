package com.student.management.mapping;

import com.student.management.dto.req.AcademicYearRequestDto;
import com.student.management.dto.resp.AcademicYearResponseDto;
import com.student.management.entity.AcademicYear;

import java.util.List;
import java.util.stream.Collectors;

public class AcademicYearMapper {

    public static AcademicYear toEntity(AcademicYearRequestDto dto) {
        return AcademicYear.builder()
                .academicYearId(dto.getAcademicYearId())
                .academicYearName(dto.getAcademicYearName())
                .build();
    }

    public static AcademicYearResponseDto toDto(AcademicYear academicYear) {
        if (academicYear == null) return null;
        return AcademicYearResponseDto.builder()
                .academicYearId(academicYear.getAcademicYearId())
                .academicYearName(academicYear.getAcademicYearName())
                .build();
    }

    public static List<AcademicYearResponseDto> toDtoList(List<AcademicYear> list) {
        if (list == null) return List.of();
        return list.stream().map(AcademicYearMapper::toDto).collect(Collectors.toList());
    }
}

