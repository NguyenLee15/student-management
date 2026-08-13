package com.student.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "academic_years")
@SQLRestriction("deleted = false")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicYear extends BaseEntity {

    @Id
    @Column(name = "academic_year_id", nullable = false, length = 10)
    @NotBlank(message = "Academic year ID is required")
    @Size(max = 10, message = "Academic year ID cannot exceed 10 characters")
    private String academicYearId;

    @Column(name = "academic_year_name", nullable = false, length = 50)
    @NotBlank(message = "Academic year name is required")
    @Size(max = 50, message = "Academic year name cannot exceed 50 characters")
    private String academicYearName;
}

