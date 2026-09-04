// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.CreditClassRequestDto;
import com.student.management.dto.resp.CreditClassResponseDto;
import com.student.management.entity.*;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.CreditClassMapper;
import com.student.management.repository.*;
import com.student.management.service.CreditClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditClassServiceImpl implements CreditClassService {

    private final CreditClassRepository creditClassRepository;
    private final SubjectRepository subjectRepository;
    private final TeacherRepository teacherRepository;
    private final ClassroomRepository classroomRepository;
    private final AcademicYearRepository academicYearRepository;
    private final StudentRepository studentRepository;
    private final CreditClassStudentRepository creditClassStudentRepository;
    private final AcademicGradeRepository academicGradeRepository;
    private final SemesterRepository semesterRepository;
    private final SemesterScheduleRepository semesterScheduleRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CreditClassResponseDto> getAll() {
        return CreditClassMapper.toDtoList(creditClassRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CreditClassResponseDto> getByTeacherId(String teacherId) {
        return CreditClassMapper.toDtoList(creditClassRepository.findByTeacherId(teacherId));
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
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp tín chỉ ID: " + creditClassId));
        return CreditClassMapper.toDto(cc);
    }

    @Override
    @Transactional
    public CreditClassResponseDto create(CreditClassRequestDto dto) {
        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy môn học: " + dto.getSubjectId()));
        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giảng viên: " + dto.getTeacherId()));
        Classroom classroom = classroomRepository.findById(dto.getClassroomId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy phòng học: " + dto.getClassroomId()));
        AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy niên khóa: " + dto.getAcademicYearId()));

        Semester semester = resolveSemester(dto, academicYear);

        CreditClass cc = CreditClassMapper.toEntity(dto, subject, teacher, classroom, academicYear);
        cc.setSemester(semester);
        cc.snapshotWeightsFromSubject();
        return CreditClassMapper.toDto(creditClassRepository.save(cc));
    }

    @Override
    @Transactional
    public CreditClassResponseDto update(Long creditClassId, CreditClassRequestDto dto) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp tín chỉ ID: " + creditClassId));

        Subject subject = subjectRepository.findById(dto.getSubjectId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy môn học: " + dto.getSubjectId()));
        Teacher teacher = teacherRepository.findById(dto.getTeacherId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy giảng viên: " + dto.getTeacherId()));
        Classroom classroom = classroomRepository.findById(dto.getClassroomId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy phòng học: " + dto.getClassroomId()));
        AcademicYear academicYear = academicYearRepository.findById(dto.getAcademicYearId())
                .orElseThrow(() -> new NotFoundException("Không tìm thấy niên khóa: " + dto.getAcademicYearId()));

        cc.setCreditClassName(dto.getCreditClassName());
        cc.setSubject(subject);
        cc.setTeacher(teacher);
        cc.setClassroom(classroom);
        cc.setAcademicYear(academicYear);
        cc.setMaxStudents(dto.getMaxStudents());

        Semester semester = resolveSemester(dto, academicYear);
        if (semester != null) {
            cc.setSemester(semester);
        }

        return CreditClassMapper.toDto(creditClassRepository.save(cc));
    }

    private Semester resolveSemester(CreditClassRequestDto dto, AcademicYear academicYear) {
        if (dto.getSemesterId() != null) {
            return semesterRepository.findById(dto.getSemesterId()).orElse(null);
        }
        if (dto.getSemester() != null) {
            String enumName = dto.getSemester().name();
            String codeSuffix = enumName.contains("1") ? "1" : (enumName.contains("2") ? "2" : "3");
            String nameKeyword = enumName.contains("1") ? "1" : (enumName.contains("2") ? "2" : "hè");

            if (academicYear != null) {
                java.util.List<Semester> yearSemesters = semesterRepository.findByAcademicYear_AcademicYearId(academicYear.getAcademicYearId());
                for (Semester s : yearSemesters) {
                    if (s.getSemesterCode() != null && s.getSemesterCode().endsWith(codeSuffix)) {
                        return s;
                    }
                    if (s.getName() != null && s.getName().toLowerCase().contains(nameKeyword)) {
                        return s;
                    }
                }
                if (!yearSemesters.isEmpty()) {
                    return yearSemesters.get(0);
                }
            }

            java.util.List<Semester> active = semesterRepository.findAllActiveSemesters();
            for (Semester s : active) {
                if (s.getSemesterCode() != null && s.getSemesterCode().endsWith(codeSuffix)) {
                    return s;
                }
                if (s.getName() != null && s.getName().toLowerCase().contains(nameKeyword)) {
                    return s;
                }
            }
            return semesterRepository.findAll().stream().findFirst().orElse(null);
        }
        return null;
    }

    @Override
    @Transactional
    public void delete(Long creditClassId) {
        if (!creditClassRepository.existsById(creditClassId)) {
            throw new NotFoundException("Không tìm thấy lớp tín chỉ ID: " + creditClassId);
        }
        creditClassRepository.deleteById(creditClassId);
    }

    @Override
    @Transactional
    public void addStudentToCreditClass(Long creditClassId, String studentId) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp tín chỉ ID: " + creditClassId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sinh viên ID: " + studentId));

        // 1. Kiểm tra duplicate enrollment
        List<CreditClassStudent> existing = creditClassStudentRepository.findByCreditClassId(creditClassId);
        boolean alreadyEnrolled = existing.stream()
                .anyMatch(ccs -> ccs.getStudent() != null && ccs.getStudent().getStudentId().equals(studentId));
        if (alreadyEnrolled) {
            throw new IllegalArgumentException("Sinh viên " + student.getFullName() + " (" + studentId + ") đã đăng ký vào lớp tín chỉ này rồi.");
        }

        // 2. Kiểm tra điều kiện môn học tiên quyết (Prerequisite validation)
        Subject subject = cc.getSubject();
        if (subject != null && subject.getPrerequisiteSubject() != null) {
            Subject prereq = subject.getPrerequisiteSubject();
            List<AcademicGrade> grades = academicGradeRepository.findByStudentIdAndSubjectId(studentId, prereq.getSubjectId());
            boolean passedPrereq = grades.stream().anyMatch(g -> 
                g.getScoreScale4() != null && g.getScoreScale4().compareTo(BigDecimal.ZERO) > 0 && !"F".equalsIgnoreCase(g.getLetterGrade())
            );
            if (!passedPrereq) {
                throw new IllegalArgumentException("Sinh viên chưa hoàn thành môn học tiên quyết bắt buộc: " 
                        + prereq.getSubjectName() + " (" + prereq.getSubjectId() + ").");
            }
        }

        // 3. Kiểm tra sĩ số lớp tín chỉ (Capacity check)
        int currentEnrolled = cc.getEnrolledCount() != null ? cc.getEnrolledCount() : 0;
        int maxCapacity = cc.getMaxStudents() != null ? cc.getMaxStudents() : 50;
        if (currentEnrolled >= maxCapacity) {
            throw new IllegalArgumentException("Lớp tín chỉ đã đủ sĩ số tối đa (" + maxCapacity + " sinh viên). Không thể đăng ký thêm.");
        }

        // 4. Mutate enrolledCount để kích hoạt Hibernate @Version Optimistic Locking
        cc.setEnrolledCount(currentEnrolled + 1);
        creditClassRepository.save(cc);

        // 5. Lưu bản ghi sinh viên đăng ký lớp tín chỉ
        CreditClassStudent ccs = CreditClassStudent.builder()
                .creditClass(cc)
                .student(student)
                .build();
        creditClassStudentRepository.save(ccs);
    }

    @Override
    @Transactional
    public void removeStudentFromCreditClass(Long creditClassId, String studentId) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy lớp tín chỉ ID: " + creditClassId));

        List<CreditClassStudent> list = creditClassStudentRepository.findByCreditClassId(creditClassId);
        list.stream()
                .filter(ccs -> ccs.getStudent().getStudentId().equals(studentId))
                .findFirst()
                .ifPresent(ccs -> {
                    creditClassStudentRepository.delete(ccs);
                    int currentEnrolled = cc.getEnrolledCount() != null ? cc.getEnrolledCount() : 1;
                    cc.setEnrolledCount(Math.max(0, currentEnrolled - 1));
                    creditClassRepository.save(cc);
                });
    }
}
