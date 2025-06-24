package com.example.student.management.service.impl;

import com.example.student.management.dto.req.User_DTO_Req;
import com.example.student.management.dto.resp.User_DTO_Resp;
import com.example.student.management.entity.User;
import com.example.student.management.enums.Role;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.exception.UserAlreadyExistsException;
import com.example.student.management.mapping.User_Mapp;
import com.example.student.management.repository.User_Repository;
import com.example.student.management.service.User_Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class User_Impl implements User_Service {

    @Autowired
    private User_Repository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Optional<User_DTO_Resp> findByUserName(String userName) {
        Optional<User> user = userRepository.findByUserName(userName);
        return user.map(User_Mapp::toDTOResp);
    }

    @Override
    public User_DTO_Resp create(User_DTO_Req dto) {
        // Kiểm tra trùng lặp userName
        if (userRepository.findByUserName(dto.getUserName()).isPresent()) {
            throw new UserAlreadyExistsException("Tên đăng nhập đã tồn tại: " + dto.getUserName());
        }
        User user = User_Mapp.toEntity(dto);
        user.setPassword(passwordEncoder.encode(dto.getPassword())); // Mã hóa mật khẩu
        User savedUser = userRepository.save(user);
        return User_Mapp.toDTOResp(savedUser);
    }

    @Override
    public void delete(String userName) {
        Optional<User> optionalUser = userRepository.findByUserName(userName);
        if (optionalUser.isEmpty()) {
            throw new NotFoundException("Không tìm thấy người dùng: " + userName);
        }
        userRepository.deleteById(optionalUser.get().getId());
    }

    @Override
    public Page<User_DTO_Resp> getAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(User_Mapp::toDTOResp);
    }

	@Override
	public Page<User_DTO_Resp> findByRole(Role role, Pageable pageable) {
		// TODO Auto-generated method stub
		return null;
	}
}