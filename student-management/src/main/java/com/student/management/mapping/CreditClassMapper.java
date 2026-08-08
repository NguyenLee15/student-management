package com.student.management.mapping;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.entity.CreditClass;
import com.student.management.entity.Subject;

import java.util.List;
import java.util.stream.Collectors;

public class CreditClassMapper {

    public static CreditClass toEntity(CreditClassRequestDto dto, Subject subject) {
        return CreditClass.builder()
                .creditClassId(dto.getCreditClassId())
                .creditClassName(dto.getCreditClassName())
                .subject(subject)
                .build();
    }

    public static CreditClassResponseDto toDto(CreditClass creditClass) {
        if (creditClass == null) return null;
        return CreditClassResponseDto.builder()
                .creditClassId(creditClass.getCreditClassId())
                .creditClassName(creditClass.getCreditClassName())
                .subjectId(creditClass.getSubject() != null ? creditClass.getSubject().getSubjectId() : null)
                .subjectName(creditClass.getSubject() != null ? creditClass.getSubject().getSubjectName() : null)
                .build();
    }

    public static List<CreditClassResponseDto> toDtoList(List<CreditClass> list) {
        if (list == null) return List.of();
        return list.stream().map(CreditClassMapper::toDto).collect(Collectors.toList());
    }
}

