package com.example.student.management.mapping;

import java.util.List;
import java.util.stream.Collectors;

import com.example.student.management.dto.req.User_DTO_Req;
import com.example.student.management.dto.resp.User_DTO_Resp;
import com.example.student.management.entity.GiangVien;
import com.example.student.management.entity.Khoa;
import com.example.student.management.entity.User;

public class User_Mapp {
    public static User toEntity(User_DTO_Req dto) {
        
        if (dto == null) return null;
        User user = new User();
        user.setUserName(dto.getUserName());
        user.setPassword(dto.getPassword());
        user.setRole(dto.getRole());
        return user;
    }

    public static User_DTO_Resp toDTOResp(User user) {
        
        if (user == null) return null;
        User_DTO_Resp resp = new User_DTO_Resp();
        resp.setUserName(user.getUserName());
        resp.setRole(user.getRole());
        return resp;
    }

    public static List<User_DTO_Resp> toDTORespList(List<User> users) {
        return users.stream()
        .map(User_Mapp::toDTOResp)
        .collect(Collectors.toList());
    }
}
