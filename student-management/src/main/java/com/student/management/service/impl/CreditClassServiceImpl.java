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
import com.student.management.dto.resp.CreditClassGradebookResponseDto;
import com.student.management.dto.resp.GradebookItemDto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
                .orElseThrow(() -> new BusinessException(ErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp tín chỉ ID: " + creditClassId));
        return CreditClassMapper.toDto(cc);
    }

    @Override
    @Transactional(readOnly = true)
    public CreditClassGradebookResponseDto getGradebook(Long creditClassId) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp tín chỉ ID: " + creditClassId));

        List<Student> students = studentRepository.findByCreditClassId(creditClassId);
        List<String> studentIds = students.stream().map(Student::getStudentId).toList();

        Map<String, AcademicGrade> gradeMap = new HashMap<>();
        if (!studentIds.isEmpty() && cc.getSubject() != null && cc.getAcademicYear() != null) {
            List<AcademicGrade> grades = academicGradeRepository.findBySubjectAndAcademicYearAndStudentIds(
                    cc.getSubject().getSubjectId(),
                    cc.getAcademicYear().getAcademicYearId(),
                    studentIds
            );
            for (AcademicGrade g : grades) {
                if (g.getStudent() != null) {
                    gradeMap.put(g.getStudent().getStudentId(), g);
                }
            }
        }

        List<GradebookItemDto> items = new ArrayList<>();
        for (Student s : students) {
            AcademicGrade g = gradeMap.get(s.getStudentId());
            GradebookItemDto item = GradebookItemDto.builder()
                    .studentId(s.getStudentId())
                    .studentName(s.getFullName())
                    .className(s.getStudentClass() != null ? s.getStudentClass().getClassName() : null)
                    .gradeId(g != null ? g.getGradeId() : null)
                    .attendanceScore(g != null ? g.getAttendanceScore() : null)
                    .midtermScore(g != null ? g.getMidtermScore() : null)
                    .finalExamScore(g != null ? g.getFinalExamScore() : null)
                    .scoreScale10(g != null ? g.getScoreScale10() : null)
                    .scoreScale4(g != null ? g.getScoreScale4() : null)
                    .letterGrade(g != null ? g.getLetterGrade() : null)
                    .isPassed(g != null && g.getScoreScale10() != null && g.getScoreScale10().compareTo(new BigDecimal("4.0")) >= 0)
                    .version(g != null ? g.getVersion() : null)
                    .build();
            items.add(item);
        }

        return CreditClassGradebookResponseDto.builder()
                .creditClassId(cc.getCreditClassId())
                .creditClassName(cc.getCreditClassName())
                .subjectId(cc.getSubject() != null ? cc.getSubject().getSubjectId() : null)
                .subjectName(cc.getSubject() != null ? cc.getSubject().getSubjectName() : null)
                .credits(cc.getSubject() != null ? cc.getSubject().getCredits() : null)
                .teacherId(cc.getTeacher() != null ? cc.getTeacher().getTeacherId() : null)
                .teacherName(cc.getTeacher() != null ? cc.getTeacher().getFullName() : null)
                .semester(cc.getSemester() != null ? cc.getSemester().getName() : null)
                .academicYear(cc.getAcademicYear() != null ? cc.getAcademicYear().getAcademicYearId() : null)
                .attendanceWeight(cc.getAttendanceWeight())
                .midtermWeight(cc.getMidtermWeight())
                .finalExamWeight(cc.getFinalExamWeight())
                .locked(Boolean.TRUE.equals(cc.getLocked()))
                .items(items)
                .build();
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
                .orElseThrow(() -> new BusinessException(ErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp tín chỉ ID: " + creditClassId));

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
            throw new BusinessException(ErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp tín chỉ ID: " + creditClassId);
        }
        creditClassRepository.deleteById(creditClassId);
    }

    @Override
    @Transactional
    public void addStudentToCreditClass(Long creditClassId, String studentId) {
        CreditClass cc = creditClassRepository.findById(creditClassId)
                .orElseThrow(() -> new BusinessException(ErrorCode.CLASS_NOT_FOUND, "Không tìm thấy lớp tín chỉ ID: " + creditClassId));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy sinh viên ID: " + studentId));

        // 1. Kiểm tra duplicate enrollment
        List<CreditClassStudent> existing = creditClassStudentRepository.findByCreditClassId(creditClassId);
        boolean alreadyEnrolled = existing.stream()
                .anyMatch(ccs -> ccs.getStudent() != null && ccs.getStudent().getStudentId().equals(studentId));
        if (alreadyEnrolled) {
            throw new BusinessException(ErrorCode.REGISTRATION_DUPLICATE_SUBJECT, "Sinh viên " + student.getFullName() + " (" + studentId + ") đã đăng ký vào lớp tín chỉ này rồi.");
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
                throw new BusinessException(ErrorCode.REGISTRATION_PREREQUISITE_FAILED, "Sinh viên chưa hoàn thành môn học tiên quyết bắt buộc: " 
                        + prereq.getSubjectName() + " (" + prereq.getSubjectId() + ").");
            }
        }

        // 3. Kiểm tra sĩ số lớp tín chỉ (Capacity check)
        int currentEnrolled = cc.getEnrolledCount() != null ? cc.getEnrolledCount() : 0;
        int maxCapacity = cc.getMaxStudents() != null ? cc.getMaxStudents() : 50;
        if (currentEnrolled >= maxCapacity) {
            throw new BusinessException(ErrorCode.REGISTRATION_CLASS_FULL, "Lớp tín chỉ đã đủ sĩ số tối đa (" + maxCapacity + " sinh viên). Không thể đăng ký thêm.");
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
