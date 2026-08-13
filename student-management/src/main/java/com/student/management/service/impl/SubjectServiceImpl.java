package com.student.management.service.impl;

import com.student.management.dto.req.SubjectRequestDto;
import com.student.management.dto.resp.SubjectResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.Subject;
import com.student.management.enums.SubjectType;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.SubjectMapper;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.SubjectRepository;
import com.student.management.service.SubjectService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SubjectServiceImpl implements SubjectService {

    private static final Logger logger = LoggerFactory.getLogger(SubjectServiceImpl.class);

    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "subjects", key = "'page_' + #page + '_' + #size")
    public Page<SubjectResponseDto> getAll(int page, int size) {
        return subjectRepository.findAll(PageRequest.of(page, size)).map(SubjectMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "subjects", key = "'all'")
    public List<SubjectResponseDto> getAll() {
        return SubjectMapper.toDtoList(subjectRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubjectResponseDto> searchBySubjectType(SubjectType subjectType, int page, int size) {
        return subjectRepository.findBySubjectType(subjectType, PageRequest.of(page, size)).map(SubjectMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubjectResponseDto> searchByFacultyId(String facultyId, int page, int size) {
        return subjectRepository.findByFacultyId(facultyId, PageRequest.of(page, size)).map(SubjectMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponseDto> getByFacultyId(String facultyId) {
        return SubjectMapper.toDtoList(subjectRepository.findByFacultyId(facultyId));
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "subjects", key = "#subjectId")
    public Optional<SubjectResponseDto> getById(String subjectId) {
        return subjectRepository.findById(subjectId).map(SubjectMapper::toDto);
    }

    @Override
    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public SubjectResponseDto create(SubjectRequestDto dto) {
        if (subjectRepository.existsById(dto.getSubjectId())) {
            throw new IllegalArgumentException("Subject ID already exists: " + dto.getSubjectId());
        }
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Faculty not found: " + dto.getFacultyId()));
        Subject subject = SubjectMapper.toEntity(dto, faculty);
        return SubjectMapper.toDto(subjectRepository.save(subject));
    }

    @Override
    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public SubjectResponseDto update(String subjectId, SubjectRequestDto dto) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NotFoundException("Subject not found: " + subjectId));
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Faculty not found: " + dto.getFacultyId()));
        subject.setSubjectName(dto.getSubjectName());
        subject.setSubjectType(dto.getSubjectType());
        subject.setTuitionPerCredit(dto.getTuitionPerCredit());
        subject.setCredits(dto.getCredits());
        subject.setFaculty(faculty);
        return SubjectMapper.toDto(subjectRepository.save(subject));
    }

    @Override
    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public void delete(String subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new NotFoundException("Subject not found: " + subjectId);
        }
        subjectRepository.deleteById(subjectId);
    }

    @Override
    public ByteArrayInputStream exportToExcel(Page<SubjectResponseDto> subjects) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Subjects");
            Row header = sheet.createRow(0);
            String[] cols = {"Subject ID", "Subject Name", "Type", "Tuition/Credit", "Credits", "Faculty"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }
            int idx = 1;
            for (SubjectResponseDto s : subjects.getContent()) {
                Row r = sheet.createRow(idx++);
                r.createCell(0).setCellValue(s.getSubjectId() != null ? s.getSubjectId() : "");
                r.createCell(1).setCellValue(s.getSubjectName() != null ? s.getSubjectName() : "");
                r.createCell(2).setCellValue(s.getSubjectType() != null ? s.getSubjectType().getDisplayName() : "");
                r.createCell(3).setCellValue(s.getTuitionPerCredit() != null ? s.getTuitionPerCredit() : 0);
                r.createCell(4).setCellValue(s.getCredits() != null ? s.getCredits() : 0);
                r.createCell(5).setCellValue(s.getFacultyName() != null ? s.getFacultyName() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Error exporting subject excel: ", e);
            throw new RuntimeException("Error exporting subject excel: " + e.getMessage());
        }
    }
}

