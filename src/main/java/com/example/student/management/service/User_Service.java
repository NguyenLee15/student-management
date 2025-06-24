package com.example.student.management.service;

import java.util.Optional;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;

import com.example.student.management.dto.req.User_DTO_Req;
import com.example.student.management.dto.resp.User_DTO_Resp;
import com.example.student.management.enums.Role;

public interface User_Service {
    // Tìm theo username 
    Optional<User_DTO_Resp> findByUserName(String userName);

    // Thêm mới user
    User_DTO_Resp create(User_DTO_Req dto);

    // Xóa user theo username
    void delete(String userName);

    // Lấy tất cả user phân trang

	Page<User_DTO_Resp> getAll(org.springframework.data.domain.Pageable pageable);

	Page<User_DTO_Resp> findByRole(Role role, org.springframework.data.domain.Pageable pageable);

}
