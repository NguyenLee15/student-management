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
@Table(name = "academic_years")
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AcademicYear extends BaseEntity {

    @Id
    @Column(name = "academic_year_id", nullable = false, length = 10)
    @NotBlank(message = "Mã năm học là bắt buộc")
    @Size(max = 10, message = "Mã năm học không được vượt quá 10 ký tự")
    private String academicYearId;

    @Column(name = "academic_year_name", nullable = false, length = 50)
    @NotBlank(message = "Academic year name là bắt buộc")
    @Size(max = 50, message = "Academic year name không được vượt quá 50 ký tự")
    private String academicYearName;
}


