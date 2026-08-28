// cSpell:disable
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
@Table(name = "faculties")
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Faculty extends BaseEntity {

    @Id
    @Column(name = "faculty_id", nullable = false, length = 10)
    @NotBlank(message = "Faculty ID is required")
    @Size(max = 10, message = "Faculty ID cannot exceed 10 characters")
    private String facultyId;

    @Column(name = "faculty_name", nullable = false, length = 100)
    @NotBlank(message = "Faculty name is required")
    @Size(max = 100, message = "Faculty name cannot exceed 100 characters")
    private String facultyName;
}


