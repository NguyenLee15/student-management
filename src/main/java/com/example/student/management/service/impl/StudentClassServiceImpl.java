package com.example.student.management.service.impl;

import com.example.student.management.dto.req.StudentClassRequestDto;
import com.example.student.management.dto.resp.StudentClassResponseDto;
import com.example.student.management.entity.Faculty;
import com.example.student.management.entity.StudentClass;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.repository.FacultyRepository;
import com.example.student.management.repository.StudentClassRepository;
import com.example.student.management.service.StudentClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentClassServiceImpl implements StudentClassService {

    @Autowired
    private StudentClassRepository studentClassRepository;

    @Autowired
    private FacultyRepository facultyRepository;

    @Override
    public Page<StudentClassResponseDto> getByFacultyId(String facultyId, Pageable pageable) {
        return studentClassRepository.findByFaculty_FacultyId(facultyId, pageable).map(this::mapToDto);
    }

    @Override
    public Page<StudentClassResponseDto> getAll(Pageable pageable) {
        return studentClassRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public List<StudentClassResponseDto> getAll() {
        return studentClassRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public StudentClassResponseDto getById(String classId) {
        StudentClass studentClass = studentClassRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Student class not found with ID: " + classId));
        return mapToDto(studentClass);
    }

    @Override
    public StudentClassResponseDto create(StudentClassRequestDto dto) {
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Faculty not found with ID: " + dto.getFacultyId()));

        StudentClass studentClass = StudentClass.builder()
                .classId(dto.getClassId())
                .className(dto.getClassName())
                .faculty(faculty)
                .build();

        return mapToDto(studentClassRepository.save(studentClass));
    }

    @Override
    public StudentClassResponseDto update(String classId, StudentClassRequestDto dto) {
        StudentClass studentClass = studentClassRepository.findById(classId)
                .orElseThrow(() -> new NotFoundException("Student class not found with ID: " + classId));

        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Faculty not found with ID: " + dto.getFacultyId()));

        studentClass.setClassName(dto.getClassName());
        studentClass.setFaculty(faculty);

        return mapToDto(studentClassRepository.save(studentClass));
    }

    @Override
    public void delete(String classId) {
        if (!studentClassRepository.existsById(classId)) {
            throw new NotFoundException("Student class not found with ID: " + classId);
        }
        studentClassRepository.deleteById(classId);
    }

    private StudentClassResponseDto mapToDto(StudentClass sc) {
        return StudentClassResponseDto.builder()
                .classId(sc.getClassId())
                .className(sc.getClassName())
                .facultyId(sc.getFaculty().getFacultyId())
                .facultyName(sc.getFaculty().getFacultyName())
                .build();
    }
}
