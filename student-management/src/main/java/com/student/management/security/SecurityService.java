// cSpell:disable
package com.student.management.security;

import com.student.management.entity.CreditClass;
import com.student.management.entity.User;
import com.student.management.repository.CreditClassRepository;
import com.student.management.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("securityService")
@lombok.RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class SecurityService {

    private final UserRepository userRepository;
    private final CreditClassRepository creditClassRepository;
    private final com.student.management.repository.AcademicGradeRepository academicGradeRepository;
    private final com.student.management.repository.CreditClassStudentRepository creditClassStudentRepository;
    private final com.student.management.repository.EnrollmentRepository enrollmentRepository;
    private final com.student.management.repository.TeacherRepository teacherRepository;
    private final com.student.management.repository.StudentRepository studentRepository;

    public boolean isSelfStudent(String studentId) {
        if (studentId == null || studentId.isEmpty()) return false;
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUserName(username);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (studentId.equals(user.getStudentId())) {
                return true;
            }
            if (user.getStudentId() == null || user.getStudentId().trim().isEmpty()) {
                try {
                    String healedId = getCurrentStudentId();
                    return studentId.equals(healedId);
                } catch (Exception e) {
                    log.debug("Không thể tự động khôi phục studentId cho người dùng {}: {}", username, e.getMessage());
                }
            }
        }
        
        return false;
    }

    public boolean isClassInstructor(Long classId) {
        if (classId == null) return false;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }

        // Admin has universal override
        if (authentication.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))) {
            return true;
        }

        String username = authentication.getName();
        Optional<User> userOpt = userRepository.findByUserName(username);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();
        Optional<CreditClass> classOpt = creditClassRepository.findById(classId);
        if (classOpt.isEmpty()) return false;

        CreditClass cc = classOpt.get();
        if (cc.getTeacher() == null) return false;

        // Check against teacher's code or id with auto-healing fallback
        if (user.getTeacherId() == null || user.getTeacherId().trim().isEmpty()) {
            try {
                String healedId = getCurrentTeacherId();
                return healedId.equalsIgnoreCase(cc.getTeacher().getTeacherId());
            } catch (Exception ignored) {
                return false;
            }
        }
        return user.getTeacherId().equalsIgnoreCase(cc.getTeacher().getTeacherId());
    }

    public boolean isStudentRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_STUDENT"));
    }

    public boolean isTeacherRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_TEACHER"));
    }

    public boolean isAdminRole() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN") || a.getAuthority().equals("ROLE_FACULTY_ADMIN"));
    }

    public boolean isFacultyAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        boolean hasFacultyRole = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_FACULTY_ADMIN"));
        return hasFacultyRole || (isAdminRole() && getCurrentFacultyId() != null);
    }

    public boolean isSuperAdmin() {
        return isAdminRole() && getCurrentFacultyId() == null;
    }

    public String getCurrentFacultyId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return null;
        }
        String username = authentication.getName();
        return userRepository.findByUserName(username)
                .map(User::getFacultyId)
                .filter(f -> f != null && !f.trim().isEmpty())
                .orElse(null);
    }

    public boolean canAccessFaculty(String facultyId) {
        if (facultyId == null || facultyId.isBlank()) return true;
        String userFacultyId = getCurrentFacultyId();
        if (userFacultyId == null) {
            // Super Admin has access to all faculties
            return true;
        }
        return userFacultyId.trim().equalsIgnoreCase(facultyId.trim());
    }

    @org.springframework.transaction.annotation.Transactional
    public String getCurrentStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.UNAUTHORIZED);
        }

        // Guard: Only ROLE_STUDENT should resolve a studentId
        if (!isStudentRole()) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.ACCESS_DENIED, "Chỉ tài khoản sinh viên mới có thể truy cập tài nguyên sinh viên.");
        }

        String username = authentication.getName();
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.USER_NOT_FOUND));
        if (user.getStudentId() != null && !user.getStudentId().trim().isEmpty()) {
            return user.getStudentId();
        }

        // Auto-heal missing student_id: only match by username if it exists as a student ID
        String resolvedStudentId = null;
        if (studentRepository.existsById(username)) {
            resolvedStudentId = username;
        }

        if (resolvedStudentId != null) {
            user.setStudentId(resolvedStudentId);
            userRepository.saveAndFlush(user);
            return resolvedStudentId;
        }

        throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.ACCESS_DENIED, "Tài khoản chưa liên kết mã sinh viên.");
    }

    @org.springframework.transaction.annotation.Transactional
    public String getCurrentTeacherId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.USER_NOT_FOUND));
        if (user.getRole() != com.student.management.enums.Role.TEACHER && !isAdminRole()) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.ACCESS_DENIED, "Tài khoản không phải là giảng viên.");
        }
        if (user.getTeacherId() != null && !user.getTeacherId().trim().isEmpty()) {
            return user.getTeacherId();
        }

        // Auto-heal missing teacher_id: only match by username if it exists as a teacher ID
        String resolvedTeacherId = null;
        if (teacherRepository.existsById(username)) {
            resolvedTeacherId = username;
        }

        if (resolvedTeacherId != null) {
            user.setTeacherId(resolvedTeacherId);
            userRepository.saveAndFlush(user);
            return resolvedTeacherId;
        }

        throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.ACCESS_DENIED, "Tài khoản chưa được liên kết với mã giảng viên.");
    }

    public boolean isSelfGrade(Integer gradeId) {
        if (gradeId == null) return false;
        if (isAdminRole()) return true;
        if (!isStudentRole()) return false;
        String studentId = getCurrentStudentId();
        return academicGradeRepository.findById(gradeId)
                .map(g -> g.getStudent() != null && studentId.equals(g.getStudent().getStudentId()))
                .orElse(false);
    }

    public boolean isClassInstructorByGradeId(Integer gradeId) {
        if (gradeId == null) return false;
        if (isAdminRole()) return true;
        if (!isTeacherRole()) return false;

        String teacherId = getCurrentTeacherId();
        Optional<com.student.management.entity.AcademicGrade> gradeOpt = academicGradeRepository.findById(gradeId);
        if (gradeOpt.isEmpty()) return false;

        com.student.management.entity.AcademicGrade grade = gradeOpt.get();
        String studentId = grade.getStudent() != null ? grade.getStudent().getStudentId() : null;
        String subjectId = grade.getSubject() != null ? grade.getSubject().getSubjectId() : null;
        String academicYear = grade.getAcademicYear();
        if (studentId == null || subjectId == null) return false;

        if (academicYear != null && !academicYear.isBlank()) {
            return creditClassStudentRepository.existsByStudentAndTeacherAndSubjectAndAcademicYear(studentId, teacherId, subjectId, academicYear)
                    || enrollmentRepository.existsByStudentAndTeacherAndSubjectAndAcademicYear(studentId, teacherId, subjectId, academicYear);
        }

        return creditClassStudentRepository.existsByStudentAndTeacherAndSubject(studentId, teacherId, subjectId)
                || enrollmentRepository.existsByStudentAndTeacherAndSubject(studentId, teacherId, subjectId);
    }

    public boolean isInstructorForGradeRequest(com.student.management.dto.req.AcademicGradeRequestDto dto) {
        if (dto == null) return false;
        if (isAdminRole()) return true;
        if (!isTeacherRole()) return false;

        String teacherId = getCurrentTeacherId();
        String studentId = dto.getStudentId();
        String subjectId = dto.getSubjectId();
        String academicYear = dto.getAcademicYear();
        if (studentId == null || subjectId == null) return false;

        if (academicYear != null && !academicYear.isBlank()) {
            return creditClassStudentRepository.existsByStudentAndTeacherAndSubjectAndAcademicYear(studentId, teacherId, subjectId, academicYear)
                    || enrollmentRepository.existsByStudentAndTeacherAndSubjectAndAcademicYear(studentId, teacherId, subjectId, academicYear);
        }

        return creditClassStudentRepository.existsByStudentAndTeacherAndSubject(studentId, teacherId, subjectId)
                || enrollmentRepository.existsByStudentAndTeacherAndSubject(studentId, teacherId, subjectId);
    }
}

