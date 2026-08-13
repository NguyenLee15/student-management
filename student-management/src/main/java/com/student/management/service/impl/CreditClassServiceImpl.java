package com.student.management.service.impl;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.entity.CreditClass;
import com.student.management.entity.CreditClassStudent;
import com.student.management.entity.Student;
import com.student.management.entity.Subject;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.CreditClassMapper;
import com.student.management.repository.CreditClassRepository;
import com.student.management.repository.CreditClassStudentRepository;
import com.student.management.repository.StudentRepository;
import com.student.management.repository.SubjectRepository;
import com.student.management.service.CreditClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditClassServiceImpl implements CreditClassService {

    private final CreditClassRepository creditClassRepository;
    private final SubjectRepository subjectRepository;
    private final StudentRepository studentRepository;
    private final CreditClassStudentRepository creditClassStudentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CreditClassResponseDto> getAll() {
        return CreditClassMapper.toDtoList(creditClassRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CreditClassResponseDto> getAll(Pageable pageable) {
        return creditClassRepository.findAll(pageable).map(CreditClassMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public CreditClassResponseDto getById(Long creditClassId) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new NotFoundException("Credit class not found: " + creditClassId));
        return CreditClassMapper.toDto(cc);
    }

    @Override
    @Transactional
    public CreditClassResponseDto create(CreditClassRequestDto dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Subject not found: " + dto.getSubjectId()));
        CreditClass cc = CreditClassMapper.toEntity(dto, subject);
        return CreditClassMapper.toDto(creditClassRepository.save(cc));
    }

    @Override
    @Transactional
    public CreditClassResponseDto update(Long creditClassId, CreditClassRequestDto dto) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new NotFoundException("Credit class not found: " + creditClassId));
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Subject not found: " + dto.getSubjectId()));
        cc.setCreditClassName(dto.getCreditClassName());
        cc.setSubject(subject);
        return CreditClassMapper.toDto(creditClassRepository.save(cc));
    }

    @Override
    @Transactional
    public void delete(Long creditClassId) {
        if (!creditClassRepository.existsById(creditClassId)) {
            throw new NotFoundException("Credit class not found: " + creditClassId);
        }
        creditClassRepository.deleteById(creditClassId);
    }

    @Override
    @Transactional
    public void addStudentToCreditClass(Long creditClassId, String studentId) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new NotFoundException("Credit class not found: " + creditClassId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Student not found: " + studentId));

        List<CreditClassStudent> existing = creditClassStudentRepository.findByCreditClassId(creditClassId);
        boolean alreadyEnrolled = existing.stream()
                .anyMatch(ccs -> ccs.getStudent() != null && ccs.getStudent().getStudentId().equals(studentId));
        if (alreadyEnrolled) {
            throw new IllegalArgumentException("Sinh viên " + student.getFullName() + " (" + studentId + ") đã đăng ký vào lớp tín chỉ này rồi.");
        }

        CreditClassStudent ccs = CreditClassStudent.builder()
                .creditClass(cc)
                .student(student)
                .build();
        creditClassStudentRepository.save(ccs);
    }

    @Override
    @Transactional
    public void removeStudentFromCreditClass(Long creditClassId, String studentId) {
        List<CreditClassStudent> list = creditClassStudentRepository.findByCreditClassId(creditClassId);
        list.stream()
                .filter(ccs -> ccs.getStudent().getStudentId().equals(studentId))
                .findFirst()
                .ifPresent(creditClassStudentRepository::delete);
    }
}

