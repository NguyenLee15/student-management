package com.example.student.management.repository;

import com.example.student.management.entity.User;
import com.example.student.management.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface User_Repository extends JpaRepository <User, Integer> {
    Optional<User> findByUserName(String userName);

    Page<User> findByRole(Role role, Pageable pageable);

    Optional<User> findByUserNameAndRole(String userName, Role role);

    // Các hàm save, deleteById, findAll có sẵn từ JpaRepository
}
