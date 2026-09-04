// cSpell:disable
package com.student.management.entity;

import com.student.management.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "users")
@SQLRestriction("deleted = false")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User extends BaseEntity {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
	
    @Column(name = "user_name", nullable = false, length = 50)
    @NotBlank(message = "UserName không được để trống")
    private String userName;

    @Column(name = "password", nullable = false, length = 255)
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @NotNull(message = "Role không được null")
    private Role role;

    @Column(name = "student_id", length = 50)
    private String studentId;

    @Column(name = "teacher_id", length = 50)
    private String teacherId;
}
