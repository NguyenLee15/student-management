// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.UserRequestDto;
import com.student.management.dto.resp.UserResponseDto;
import com.student.management.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class UserMapper {

    public static User toEntity(UserRequestDto dto) {
        return User.builder()
                .userName(dto.getUserName())
                .password(dto.getPassword())
                .role(dto.getRole())
                .studentId(dto.getStudentId())
                .teacherId(dto.getTeacherId())
                .build();
    }

    public static UserResponseDto toDto(User user) {
        if (user == null) return null;
        return UserResponseDto.builder()
                .id(user.getId())
                .userName(user.getUserName())
                .role(user.getRole())
                .studentId(user.getStudentId())
                .teacherId(user.getTeacherId())
                .build();
    }

    public static List<UserResponseDto> toDtoList(List<User> list) {
        if (list == null) return List.of();
        return list.stream().map(UserMapper::toDto).collect(Collectors.toList());
    }
}

