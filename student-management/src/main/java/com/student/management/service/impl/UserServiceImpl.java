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
                .orElseThrow(() -> new NotFoundException("User not found: " + userName));
    }

    @Override
    @Transactional
    public UserResponseDto create(UserRequestDto dto) {
        if (userRepository.findByUserName(dto.getUserName()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists: " + dto.getUserName());
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
            return UserMapper.toDto(userRepository.save(user));
        } else {
            return create(dto);
        }
    }

    @Override
    @Transactional
    public void changePassword(String userName, ChangePasswordDto dto) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new NotFoundException("User not found: " + userName));

        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không chính xác");
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void delete(String userName) {
        User user = userRepository.findByUserName(userName)
                .orElseThrow(() -> new NotFoundException("User not found: " + userName));
        userRepository.delete(user);
    }
}
