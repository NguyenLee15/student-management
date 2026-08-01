package com.example.student.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "faculties")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Faculty {
    @Id
    @Column(name = "faculty_id", nullable = false, length = 10)
    @NotBlank(message = "Faculty ID is required")
    private String facultyId;

    @Column(name = "faculty_name", nullable = false, length = 100)
    @NotBlank(message = "Faculty name is required")
    private String facultyName;
}
