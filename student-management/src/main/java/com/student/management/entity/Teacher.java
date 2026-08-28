// cSpell:disable
package com.student.management.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "teachers")
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Teacher extends BaseEntity {

    @Id
    @Column(name = "teacher_id", nullable = false, length = 10)
    @NotBlank(message = "Teacher ID is required")
    @Size(max = 10, message = "Teacher ID cannot exceed 10 characters")
    private String teacherId;

    @Column(name = "full_name", nullable = false, length = 100)
    @NotBlank(message = "Teacher name is required")
    @Size(max = 100, message = "Teacher name cannot exceed 100 characters")
    private String fullName;

    @Column(name = "email", nullable = false, length = 100)
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @NotNull(message = "Faculty is required")
    private Faculty faculty;
}


