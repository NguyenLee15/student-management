// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private Integer id;
    private String userName;
    private Role role;
    private String studentId;
    private String teacherId;
}
