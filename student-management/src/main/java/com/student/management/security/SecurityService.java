package com.student.management.security;

import com.student.management.entity.CreditClass;
import com.student.management.entity.User;
import com.student.management.repository.CreditClassRepository;
import com.student.management.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service("securityEvaluator")
public class SecurityService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CreditClassRepository creditClassRepository;

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

    public String getCurrentStudentId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.UNAUTHORIZED);
        }
        String username = authentication.getName();
        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new com.student.management.exception.BusinessException(com.student.management.exception.ErrorCode.USER_NOT_FOUND));
        if (user.getStudentId() == null || user.getStudentId().isEmpty()) {
            // Fallback: nếu username là sinh viên (ví dụ SV001)
            if (user.getUserName() != null && user.getUserName().startsWith("SV")) {
                return user.getUserName();
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
        if (user.getUserName() != null && user.getUserName().startsWith("GV")) {
            return user.getUserName();
        }
        return user.getUserName();
    }
}
