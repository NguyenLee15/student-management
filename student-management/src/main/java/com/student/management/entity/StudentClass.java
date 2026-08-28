// cSpell:disable
package com.student.management.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student_classes")
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StudentClass extends BaseEntity {

    @Id
    @Column(name = "class_id", nullable = false, length = 10)
    @NotBlank(message = "Mã lớp là bắt buộc")
    @Size(max = 10, message = "Mã lớp không được vượt quá 10 ký tự")
    private String classId;

    @Column(name = "class_name", nullable = false, length = 100)
    @NotBlank(message = "Tên lớp là bắt buộc")
    @Size(max = 100, message = "Tên lớp không được vượt quá 100 ký tự")
    private String className;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculty_id", nullable = false)
    @NotNull(message = "Khoa là bắt buộc")
    private Faculty faculty;
}


