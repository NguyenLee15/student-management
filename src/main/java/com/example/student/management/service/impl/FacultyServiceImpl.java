package com.example.student.management.service.impl;

import com.example.student.management.dto.req.FacultyRequestDto;
import com.example.student.management.dto.resp.FacultyResponseDto;
import com.example.student.management.entity.Faculty;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.repository.FacultyRepository;
import com.example.student.management.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyServiceImpl implements FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    @Override
    public Page<FacultyResponseDto> getAll(Pageable pageable) {
        return facultyRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public List<FacultyResponseDto> getAll() {
        return facultyRepository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FacultyResponseDto getById(String facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new NotFoundException("Faculty not found with ID: " + facultyId));
        return mapToDto(faculty);
    }

    @Override
    public FacultyResponseDto create(FacultyRequestDto dto) {
        Faculty faculty = Faculty.builder()
                .facultyId(dto.getFacultyId())
                .facultyName(dto.getFacultyName())
                .build();
        return mapToDto(facultyRepository.save(faculty));
    }

    @Override
    public FacultyResponseDto update(String facultyId, FacultyRequestDto dto) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new NotFoundException("Faculty not found with ID: " + facultyId));
        faculty.setFacultyName(dto.getFacultyName());
        return mapToDto(facultyRepository.save(faculty));
    }

    @Override
    public void delete(String facultyId) {
        if (!facultyRepository.existsById(facultyId)) {
            throw new NotFoundException("Faculty not found with ID: " + facultyId);
        }
        facultyRepository.deleteById(facultyId);
    }

    private FacultyResponseDto mapToDto(Faculty faculty) {
        return FacultyResponseDto.builder()
                .facultyId(faculty.getFacultyId())
                .facultyName(faculty.getFacultyName())
                .build();
    }
}
