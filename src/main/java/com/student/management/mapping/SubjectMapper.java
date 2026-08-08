package com.student.management.mapping;

import com.student.management.dto.req.SubjectRequestDto;
import com.student.management.dto.resp.SubjectResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.Subject;

import java.util.List;
import java.util.stream.Collectors;

public class SubjectMapper {

    public static Subject toEntity(SubjectRequestDto dto, Faculty faculty) {
        return Subject.builder()
                .subjectId(dto.getSubjectId())
                .subjectName(dto.getSubjectName())
                .subjectType(dto.getSubjectType())
                .tuitionPerCredit(dto.getTuitionPerCredit())
                .credits(dto.getCredits())
                .faculty(faculty)
                .build();
    }

    public static SubjectResponseDto toDto(Subject subject) {
        if (subject == null) return null;
        return SubjectResponseDto.builder()
                .subjectId(subject.getSubjectId())
                .subjectName(subject.getSubjectName())
                .subjectType(subject.getSubjectType())
                .tuitionPerCredit(subject.getTuitionPerCredit())
                .credits(subject.getCredits())
                .facultyId(subject.getFaculty() != null ? subject.getFaculty().getFacultyId() : null)
                .facultyName(subject.getFaculty() != null ? subject.getFaculty().getFacultyName() : null)
                .build();
    }

    public static List<SubjectResponseDto> toDtoList(List<Subject> list) {
        if (list == null) return List.of();
        return list.stream().map(SubjectMapper::toDto).collect(Collectors.toList());
    }
}

