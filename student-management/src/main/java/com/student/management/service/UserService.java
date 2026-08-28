// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.ChangePasswordDto;
import com.student.management.dto.req.UserRequestDto;
import com.student.management.dto.resp.UserResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface UserService {
    Page<UserResponseDto> getAll(Pageable pageable);
    Optional<UserResponseDto> findByUserName(String userName);
    UserResponseDto getByUserName(String userName);
    UserResponseDto create(UserRequestDto dto);
    UserResponseDto saveOrUpdate(UserRequestDto dto);
    void changePassword(String userName, ChangePasswordDto dto);
    void forgotPassword(String email, String appUrl);
    void resetPassword(String token, String newPassword);
    void delete(String userName);
}
