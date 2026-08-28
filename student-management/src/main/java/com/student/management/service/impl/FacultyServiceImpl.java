// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.FacultyRequestDto;
import com.student.management.dto.resp.FacultyResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.FacultyMapper;
import com.student.management.repository.FacultyRepository;
import com.student.management.service.FacultyService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "faculties", key = "'page_' + #pageable.pageNumber + '_' + #pageable.pageSize")
    public Page<FacultyResponseDto> getAll(Pageable pageable) {
        return facultyRepository.findAll(pageable).map(FacultyMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "faculties", key = "'all'")
    public List<FacultyResponseDto> getAll() {
        return FacultyMapper.toDtoList(facultyRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "faculties", key = "#facultyId")
    public FacultyResponseDto getById(String facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa: " + facultyId));
        return FacultyMapper.toDto(faculty);
    }

    @Override
    @Transactional
    @CacheEvict(value = "faculties", allEntries = true)
    public FacultyResponseDto create(FacultyRequestDto dto) {
        if (facultyRepository.existsById(dto.getFacultyId())) {
            throw new IllegalArgumentException("Mã khoa đã tồn tại: " + dto.getFacultyId());
        }
        Faculty faculty = FacultyMapper.toEntity(dto);
        return FacultyMapper.toDto(facultyRepository.save(faculty));
    }

    @Override
    @Transactional
    @CacheEvict(value = "faculties", allEntries = true)
    public FacultyResponseDto update(String facultyId, FacultyRequestDto dto) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa: " + facultyId));
        faculty.setFacultyName(dto.getFacultyName());
        return FacultyMapper.toDto(facultyRepository.save(faculty));
    }

    @Override
    @Transactional
    @CacheEvict(value = "faculties", allEntries = true)
    public void delete(String facultyId) {
        if (!facultyRepository.existsById(facultyId)) {
            throw new NotFoundException("Không tìm thấy khoa: " + facultyId);
        }
        facultyRepository.deleteById(facultyId);
    }
}

