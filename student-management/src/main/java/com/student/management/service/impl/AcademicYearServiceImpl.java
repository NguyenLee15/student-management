package com.student.management.service.impl;

import com.student.management.dto.req.AcademicYearRequestDto;
import com.student.management.dto.resp.AcademicYearResponseDto;
import com.student.management.entity.AcademicYear;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.AcademicYearMapper;
import com.student.management.repository.AcademicYearRepository;
import com.student.management.service.AcademicYearService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AcademicYearServiceImpl implements AcademicYearService {

    private final AcademicYearRepository academicYearRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<AcademicYearResponseDto> getAll(Pageable pageable) {
        return academicYearRepository.findAll(pageable).map(AcademicYearMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AcademicYearResponseDto> getAll() {
        return AcademicYearMapper.toDtoList(academicYearRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public AcademicYearResponseDto getById(String academicYearId) {
        AcademicYear year = academicYearRepository.findById(academicYearId)
                .orElseThrow(() -> new NotFoundException("Academic year not found: " + academicYearId));
        return AcademicYearMapper.toDto(year);
    }

    @Override
    @Transactional
    public AcademicYearResponseDto create(AcademicYearRequestDto dto) {
        if (academicYearRepository.existsById(dto.getAcademicYearId())) {
            throw new IllegalArgumentException("Academic year ID already exists: " + dto.getAcademicYearId());
        }
        AcademicYear year = AcademicYearMapper.toEntity(dto);
        return AcademicYearMapper.toDto(academicYearRepository.save(year));
    }

    @Override
    @Transactional
    public AcademicYearResponseDto update(String academicYearId, AcademicYearRequestDto dto) {
        AcademicYear year = academicYearRepository.findById(academicYearId)
                .orElseThrow(() -> new NotFoundException("Academic year not found: " + academicYearId));
        year.setAcademicYearName(dto.getAcademicYearName());
        return AcademicYearMapper.toDto(academicYearRepository.save(year));
    }

    @Override
    @Transactional
    public void delete(String academicYearId) {
        if (!academicYearRepository.existsById(academicYearId)) {
            throw new NotFoundException("Academic year not found: " + academicYearId);
        }
        academicYearRepository.deleteById(academicYearId);
    }
}

