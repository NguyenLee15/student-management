package com.student.management.service.impl;

import com.student.management.dto.req.TuitionPolicyRequestDto;
import com.student.management.dto.resp.TuitionPolicyResponseDto;
import com.student.management.entity.*;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.SemesterRepository;
import com.student.management.repository.TuitionPolicyRepository;
import com.student.management.service.TuitionPolicyService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TuitionPolicyServiceImpl implements TuitionPolicyService {

    private final TuitionPolicyRepository tuitionPolicyRepository;
    private final SemesterRepository semesterRepository;
    private final FacultyRepository facultyRepository;

    @Override
    @Transactional(readOnly = true)
    public List<TuitionPolicyResponseDto> getAllPolicies() {
        return tuitionPolicyRepository.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<TuitionPolicyResponseDto> getPoliciesBySemester(Long semesterId) {
        return tuitionPolicyRepository.findBySemester_Id(semesterId).stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    @Transactional
    public TuitionPolicyResponseDto createPolicy(TuitionPolicyRequestDto requestDto) {
        Semester semester = semesterRepository.findById(requestDto.getSemesterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy học kỳ có ID: " + requestDto.getSemesterId()));

        Faculty faculty = null;
        if (requestDto.getFacultyId() != null && !requestDto.getFacultyId().trim().isEmpty()) {
            faculty = facultyRepository.findById(requestDto.getFacultyId().trim())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy khoa có mã: " + requestDto.getFacultyId()));
        }

        TuitionPolicy policy = TuitionPolicy.builder()
                .semester(semester)
                .faculty(faculty)
                .unitPricePerCredit(requestDto.getUnitPricePerCredit())
                .effectiveDate(requestDto.getEffectiveDate() != null ? requestDto.getEffectiveDate() : LocalDate.now())
                .active(requestDto.getActive() != null ? requestDto.getActive() : true)
                .build();

        TuitionPolicy saved = tuitionPolicyRepository.save(policy);
        log.info("TUITION_POLICY_CREATED id={} semesterId={} facultyId={} price={}",
                saved.getId(), semester.getId(), faculty != null ? faculty.getFacultyId() : "ALL", saved.getUnitPricePerCredit());

        return toDto(saved);
    }

    @Override
    @Transactional
    public TuitionPolicyResponseDto updatePolicy(Long id, TuitionPolicyRequestDto requestDto) {
        TuitionPolicy policy = tuitionPolicyRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy biểu phí học phí ID: " + id));

        Semester semester = semesterRepository.findById(requestDto.getSemesterId())
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy học kỳ ID: " + requestDto.getSemesterId()));

        Faculty faculty = null;
        if (requestDto.getFacultyId() != null && !requestDto.getFacultyId().trim().isEmpty()) {
            faculty = facultyRepository.findById(requestDto.getFacultyId().trim())
                    .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy khoa: " + requestDto.getFacultyId()));
        }

        policy.setSemester(semester);
        policy.setFaculty(faculty);
        policy.setUnitPricePerCredit(requestDto.getUnitPricePerCredit());
        if (requestDto.getEffectiveDate() != null) {
            policy.setEffectiveDate(requestDto.getEffectiveDate());
        }
        if (requestDto.getActive() != null) {
            policy.setActive(requestDto.getActive());
        }

        TuitionPolicy updated = tuitionPolicyRepository.save(policy);
        log.info("TUITION_POLICY_UPDATED id={} price={}", updated.getId(), updated.getUnitPricePerCredit());
        return toDto(updated);
    }

    @Override
    @Transactional
    public void toggleActive(Long id) {
        TuitionPolicy policy = tuitionPolicyRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy biểu phí ID: " + id));
        policy.setActive(!Boolean.TRUE.equals(policy.getActive()));
        tuitionPolicyRepository.save(policy);
        log.info("TUITION_POLICY_TOGGLED id={} newActive={}", id, policy.getActive());
    }

    @Override
    @Transactional
    public void deletePolicy(Long id) {
        TuitionPolicy policy = tuitionPolicyRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ErrorCode.RESOURCE_NOT_FOUND, "Không tìm thấy biểu phí ID: " + id));
        policy.setDeleted(true);
        tuitionPolicyRepository.save(policy);
        log.info("TUITION_POLICY_DELETED id={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public BigDecimal getEffectiveUnitPrice(Student student, CreditClass creditClass, LocalDate date) {
        LocalDate queryDate = date != null ? date : LocalDate.now();
        Long semesterId = creditClass.getSemester() != null ? creditClass.getSemester().getId() : 1L;

        // Ưu tiên 1: Chính sách theo Khoa của Sinh viên
        if (student != null && student.getStudentClass() != null && student.getStudentClass().getFaculty() != null) {
            String facultyId = student.getStudentClass().getFaculty().getFacultyId();
            List<TuitionPolicy> facultyPolicies = tuitionPolicyRepository.findFacultySpecificPolicy(semesterId, facultyId, queryDate);
            if (!facultyPolicies.isEmpty()) {
                return facultyPolicies.get(0).getUnitPricePerCredit();
            }
        }

        // Ưu tiên 2: Chính sách chung toàn trường (faculty = null)
        List<TuitionPolicy> universityPolicies = tuitionPolicyRepository.findUniversityWidePolicy(semesterId, queryDate);
        if (!universityPolicies.isEmpty()) {
            return universityPolicies.get(0).getUnitPricePerCredit();
        }

        // Ưu tiên 3: Mặc định từ Subject hoặc 450,000 VNĐ
        if (creditClass.getSubject() != null && creditClass.getSubject().getTuitionPerCredit() != null) {
            return BigDecimal.valueOf(creditClass.getSubject().getTuitionPerCredit());
        }

        return new BigDecimal("450000.00");
    }

    private TuitionPolicyResponseDto toDto(TuitionPolicy policy) {
        Semester sem = policy.getSemester();
        Faculty fac = policy.getFaculty();
        return TuitionPolicyResponseDto.builder()
                .id(policy.getId())
                .semesterId(sem != null ? sem.getId() : null)
                .semesterName(sem != null ? sem.getName() : null)
                .semesterCode(sem != null ? sem.getSemesterCode() : null)
                .facultyId(fac != null ? fac.getFacultyId() : null)
                .facultyName(fac != null ? fac.getFacultyName() : "Áp dụng toàn trường")
                .unitPricePerCredit(policy.getUnitPricePerCredit())
                .effectiveDate(policy.getEffectiveDate())
                .active(policy.getActive())
                .scope(fac != null ? ("KHOA " + fac.getFacultyName()) : "TOÀN TRƯỜNG")
                .build();
    }
}
