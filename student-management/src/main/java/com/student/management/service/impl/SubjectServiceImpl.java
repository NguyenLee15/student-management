// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.SubjectRequestDto;
import com.student.management.dto.resp.SubjectResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.Subject;
import com.student.management.enums.SubjectType;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.SubjectMapper;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.SubjectRepository;
import com.student.management.service.SubjectService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Optional;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

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
            throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Mã môn học đã tồn tại: " + dto.getSubjectId());
        }
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa: " + dto.getFacultyId()));
        
        Subject prerequisiteSubject = null;
        if (dto.getPrerequisiteSubjectId() != null && !dto.getPrerequisiteSubjectId().isBlank()) {
            if (dto.getPrerequisiteSubjectId().equalsIgnoreCase(dto.getSubjectId())) {
                throw new BusinessException(ErrorCode.VALIDATION_ERROR, "Môn học không thể tự làm môn tiên quyết của chính nó");
            }
            prerequisiteSubject = subjectRepository.findById(dto.getPrerequisiteSubjectId())
                    .orElseThrow(() -> new NotFoundException("Môn tiên quyết không tồn tại: " + dto.getPrerequisiteSubjectId()));
        }

        validateWeights(dto.getAttendanceWeight(), dto.getMidtermWeight(), dto.getFinalExamWeight());
        Subject subject = SubjectMapper.toEntity(dto, faculty, prerequisiteSubject);
        return SubjectMapper.toDto(subjectRepository.save(subject));
    }

    @Override
    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public SubjectResponseDto update(String subjectId, SubjectRequestDto dto) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy môn học: " + subjectId));
        Faculty faculty = facultyRepository.findById(dto.getFacultyId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy khoa: " + dto.getFacultyId()));

        Subject prerequisiteSubject = null;
        if (dto.getPrerequisiteSubjectId() != null && !dto.getPrerequisiteSubjectId().isBlank()) {
            if (dto.getPrerequisiteSubjectId().equalsIgnoreCase(subjectId)) {
                throw new IllegalArgumentException("Môn học không thể tự làm môn tiên quyết của chính nó");
            }
            prerequisiteSubject = subjectRepository.findById(dto.getPrerequisiteSubjectId())
                    .orElseThrow(() -> new NotFoundException("Môn tiên quyết không tồn tại: " + dto.getPrerequisiteSubjectId()));
        }

        subject.setSubjectName(dto.getSubjectName());
        subject.setSubjectType(dto.getSubjectType());
        subject.setTuitionPerCredit(dto.getTuitionPerCredit());
        subject.setCredits(dto.getCredits());
        subject.setFaculty(faculty);
        subject.setPrerequisiteSubject(prerequisiteSubject);
        validateWeights(
            dto.getAttendanceWeight() != null ? dto.getAttendanceWeight() : subject.getAttendanceWeight(),
            dto.getMidtermWeight() != null ? dto.getMidtermWeight() : subject.getMidtermWeight(),
            dto.getFinalExamWeight() != null ? dto.getFinalExamWeight() : subject.getFinalExamWeight()
        );
        if (dto.getAttendanceWeight() != null) subject.setAttendanceWeight(dto.getAttendanceWeight());
        if (dto.getMidtermWeight() != null) subject.setMidtermWeight(dto.getMidtermWeight());
        if (dto.getFinalExamWeight() != null) subject.setFinalExamWeight(dto.getFinalExamWeight());
        return SubjectMapper.toDto(subjectRepository.save(subject));
    }

    @Override
    @Transactional
    @CacheEvict(value = "subjects", allEntries = true)
    public void delete(String subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            throw new NotFoundException("Không tìm thấy môn học: " + subjectId);
        }
        subjectRepository.deleteById(subjectId);
    }

    @Override
    public ByteArrayInputStream exportToExcel(Page<SubjectResponseDto> subjects) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Môn học");
            Row header = sheet.createRow(0);
            String[] cols = {"Mã Môn Học", "Tên Môn Học", "Loại Học Phần", "Học Phí/Tín Chỉ", "Số Tín Chỉ", "Khoa Quản Lý", "Môn Tiên Quyết"};
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
                r.createCell(6).setCellValue(s.getPrerequisiteSubjectName() != null ? s.getPrerequisiteSubjectName() : "Không");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Lỗi khi xuất danh sách subject ra file Excel: ", e);
            throw new RuntimeException("Lỗi khi xuất danh sách subject ra file Excel: " + e.getMessage());
        }
    }
    private void validateWeights(BigDecimal attendance, BigDecimal midterm, BigDecimal finalExam) {
        if (attendance != null && midterm != null && finalExam != null) {
            BigDecimal sum = attendance.add(midterm).add(finalExam);
            if (sum.compareTo(new BigDecimal("1.00")) != 0) {
                throw new BusinessException(ErrorCode.INVALID_GRADE_WEIGHT_SUM,
                    "Tổng trọng số điểm (Chuyên cần + Giữa kỳ + Cuối kỳ) phải bằng đúng 1.00. Hiện tại: " + sum);
            }
        }
    }
}
