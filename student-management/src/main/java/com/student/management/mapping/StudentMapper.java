// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.StudentRequestDto;
import com.student.management.dto.resp.StudentResponseDto;
import com.student.management.entity.AcademicYear;
import com.student.management.entity.Student;
import com.student.management.entity.StudentClass;

import java.util.List;
import java.util.stream.Collectors;

public class StudentMapper {

    public static Student toEntity(StudentRequestDto dto, StudentClass studentClass, AcademicYear academicYear) {
        return Student.builder()
                .studentId(dto.getStudentId())
                .fullName(dto.getFullName())
                .dateOfBirth(dto.getDateOfBirth())
                .gender(dto.getGender())
                .studentClass(studentClass)
                .academicYear(academicYear)
                .email(dto.getEmail())
                .build();
    }

    public static StudentResponseDto toDto(Student student) {
        if (student == null) return null;
        return StudentResponseDto.builder()
                .studentId(student.getStudentId())
                .fullName(student.getFullName())
                .dateOfBirth(student.getDateOfBirth())
                .gender(student.getGender())
                .classId(student.getStudentClass() != null ? student.getStudentClass().getClassId() : null)
                .className(student.getStudentClass() != null ? student.getStudentClass().getClassName() : null)
                .facultyId(student.getStudentClass() != null && student.getStudentClass().getFaculty() != null ? student.getStudentClass().getFaculty().getFacultyId() : null)
                .facultyName(student.getStudentClass() != null && student.getStudentClass().getFaculty() != null ? student.getStudentClass().getFaculty().getFacultyName() : null)
                .academicYearId(student.getAcademicYear() != null ? student.getAcademicYear().getAcademicYearId() : null)
                .email(student.getEmail())
                .build();
    }

    public static List<StudentResponseDto> toDtoList(List<Student> students) {
        if (students == null) return List.of();
        return students.stream().map(StudentMapper::toDto).collect(Collectors.toList());
    }
}

