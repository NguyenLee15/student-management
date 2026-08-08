package com.student.management.entity;

import com.student.management.enums.SubjectType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "subjects")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Subject {

    @Id
    @Column(name = "subject_id", nullable = false, length = 10)
    @NotBlank(message = "Subject ID is required")
    @Size(max = 10, message = "Subject ID cannot exceed 10 characters")
    private String subjectId;

    @Column(name = "subject_name", nullable = false, length = 100)
    @NotBlank(message = "Subject name is required")
    @Size(max = 100, message = "Subject name cannot exceed 100 characters")
    private String subjectName;

    @Enumerated(EnumType.STRING)
    @Column(name = "subject_type", nullable = false)
    @NotNull(message = "Subject type is required")
    private SubjectType subjectType;

    @Min(value = 1, message = "Tuition per credit must be greater than 0")
    @Column(name = "tuition_per_credit", nullable = false)
    private Integer tuitionPerCredit;

    @Min(value = 1, message = "Credits must be greater than 0")
    @Column(name = "credits", nullable = false)
    private Integer credits;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @NotNull(message = "Faculty is required")
    private Faculty faculty;
}

