package com.example.student.management.dto.resp;

import com.example.student.management.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User_DTO_Resp {
    private Integer id;
    private String userName;
    private Role role;
    private String token;
}