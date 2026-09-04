// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.ChangePasswordDto;
import com.student.management.dto.req.UserRequestDto;
import com.student.management.dto.resp.UserResponseDto;
import com.student.management.entity.User;
import com.student.management.exception.NotFoundException;
import com.student.management.exception.UserAlreadyExistsException;
import com.student.management.mapping.UserMapper;
import com.student.management.repository.UserRepository;
import com.student.management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final com.student.management.repository.StudentRepository studentRepository;
    private final com.student.management.repository.TeacherRepository teacherRepository;
    private final com.student.management.repository.PasswordResetTokenRepository passwordResetTokenRepository;
    private final com.student.management.service.EmailService emailService;



    @Override
    @Transactional(readOnly = true)
    public Page<UserResponseDto> getAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(UserMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<UserResponseDto> findByUserName(String userName) {
        return userRepository.findByUserName(userName).map(UserMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponseDto getByUserName(String userName) {
        return findByUserName(userName)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng: " + userName));
    }

    @Override
    @Transactional
    public UserResponseDto create(UserRequestDto dto) {
        if (userRepository.findByUserName(dto.getUserName()).isPresent()) {
            throw new UserAlreadyExistsException("Tên đăng nhập đã tồn tại: " + dto.getUserName());
        }
        User user = UserMapper.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        return UserMapper.toDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponseDto saveOrUpdate(UserRequestDto dto) {
        Optional<User> existing = userRepository.findByUserName(dto.getUserName());
        if (existing.isPresent()) {
            User user = existing.get();
            if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            if (dto.getRole() != null) {
                user.setRole(dto.getRole());
            }
            if (dto.getStudentId() != null) {
                user.setStudentId(dto.getStudentId());
            }
            if (dto.getTeacherId() != null) {
                user.setTeacherId(dto.getTeacherId());
            }
            return UserMapper.toDto(userRepository.save(user));
        } else {
            return create(dto);
        }
    }

    @Override
    @Transactional
    public void changePassword(String userName, ChangePasswordDto dto) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng: " + userName));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void forgotPassword(String email, String appUrl) {
        String userName = null;
        var studentOpt = studentRepository.findByEmail(email);
        if (studentOpt.isPresent()) {
            userName = studentOpt.get().getStudentId();
        } else {
            var teacherOpt = teacherRepository.findByEmail(email);
            if (teacherOpt.isPresent()) {
                userName = teacherOpt.get().getTeacherId();
            }
        }
        
        if (userName == null) return; 
        
        var user = userRepository.findByUserName(userName).orElse(null);
        if (user == null) return;
        
        String token = java.util.UUID.randomUUID().toString();
        var resetToken = com.student.management.entity.PasswordResetToken.builder()
                .token(token)
                .userName(userName)
                .expiresAt(java.time.LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();
                
        passwordResetTokenRepository.save(resetToken);
        String resetLink = appUrl + "/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(email, resetLink);
    }

    @Override
    @Transactional
    public void resetPassword(String token, String newPassword) {
        var resetToken = passwordResetTokenRepository.findByTokenAndUsedFalse(token)
                .orElseThrow(() -> new IllegalArgumentException("Token không hợp lệ hoặc đã hết hạn"));
                
        if (resetToken.isExpired()) {
            throw new IllegalArgumentException("Token đã hết hạn");
        }
        
        var user = userRepository.findByUserName(resetToken.getUserName())
                .orElseThrow(() -> new com.student.management.exception.NotFoundException("Không tìm thấy người dùng"));
                
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);
    }


    @Override
    @Transactional
    public void delete(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new NotFoundException("Không tìm thấy người dùng: " + userName));
        userRepository.delete(user);
    }
}


