// cSpell:disable
package com.student.management.entity;

import com.student.management.enums.Building;
import jakarta.persistence.*;
import org.hibernate.annotations.SQLRestriction;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "classrooms")
@SQLRestriction("deleted = false")
@Data
@lombok.EqualsAndHashCode(callSuper = true)
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Classroom extends BaseEntity {

    @Id
    @Column(name = "classroom_id", nullable = false, length = 10)
    @NotBlank(message = "Mã phòng là bắt buộc")
    @Size(max = 10, message = "Mã phòng không được vượt quá 10 ký tự")
    private String roomId;

    @Column(name = "room_name", nullable = false, length = 100)
    @NotBlank(message = "Tên phòng là bắt buộc")
    @Size(max = 100, message = "Tên phòng không được vượt quá 100 ký tự")
    private String roomName;

    @Column(name = "capacity", nullable = false)
    @Min(value = 1, message = "Sức chứa phải lớn hơn 0")
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "building", nullable = false)
    @NotNull(message = "Tòa nhà là bắt buộc")
    private Building building;
}


