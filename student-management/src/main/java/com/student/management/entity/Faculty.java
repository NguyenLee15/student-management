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
    @NotBlank(message = "Mã khoa là bắt buộc")
    @Size(max = 10, message = "Mã khoa không được vượt quá 10 ký tự")
    private String facultyId;

    @Column(name = "faculty_name", nullable = false, length = 100)
    @NotBlank(message = "Tên khoa là bắt buộc")
    @Size(max = 100, message = "Tên khoa không được vượt quá 100 ký tự")
    private String facultyName;
}


