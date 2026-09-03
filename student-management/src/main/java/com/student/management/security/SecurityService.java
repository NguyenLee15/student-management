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

@Service("securityEvaluator")
@lombok.RequiredArgsConstructor
public class SecurityService {

    private final UserRepository userRepository;

    private final CreditClassRepository creditClassRepository;

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
            return studentId.equals(user.getStudentId());
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

        // Check against teacher's code or id
        return user.getUserName() != null && user.getUserName().equalsIgnoreCase(cc.getTeacher().getTeacherId());
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
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    public String getCurrentStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.USER_NOT_FOUND));
        if (user.getStudentId() == null || user.getStudentId().trim().isEmpty()) {
            if (isAdminRole()) {
                return "SV001";
            }
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.ACCESS_DENIED, "Tài khoản chưa liên kết mã sinh viên.");
        }
        return user.getStudentId();
    }

    public String getCurrentTeacherId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.USER_NOT_FOUND));
        if (user.getRole() != com.student.management.enums.Role.TEACHER) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.ACCESS_DENIED, "Tài khoản không phải là giảng viên.");
        }
        return user.getUserName();
    }
}

