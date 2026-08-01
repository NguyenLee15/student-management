package com.example.student.management.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "academic_years")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicYear {
    @Id
    @Column(name = "academic_year_id", nullable = false, length = 10)
    @NotBlank(message = "Academic year ID is required")
    private String academicYearId;

    @Column(name = "start_year", nullable = false)
    @Min(value = 1900, message = "Start year must be greater than 1900")
    private Integer startYear;

    @Column(name = "end_year", nullable = false)
    @Min(value = 1900, message = "End year must be greater than 1900")
    private Integer endYear;
}
