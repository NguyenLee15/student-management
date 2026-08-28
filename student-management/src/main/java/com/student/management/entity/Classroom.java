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
    @NotBlank(message = "Room ID is required")
    @Size(max = 10, message = "Room ID cannot exceed 10 characters")
    private String roomId;

    @Column(name = "room_name", nullable = false, length = 100)
    @NotBlank(message = "Room name is required")
    @Size(max = 100, message = "Room name cannot exceed 100 characters")
    private String roomName;

    @Column(name = "capacity", nullable = false)
    @Min(value = 1, message = "Capacity must be greater than 0")
    private int capacity;

    @Enumerated(EnumType.STRING)
    @Column(name = "building", nullable = false)
    @NotNull(message = "Building is required")
    private Building building;
}


