package com.student.management.dto.req;

import com.student.management.enums.Building;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClassroomRequestDto {

    @NotBlank(message = "Room ID cannot be blank")
    @Size(max = 10, message = "Room ID cannot exceed 10 characters")
    private String roomId;

    @NotBlank(message = "Room name cannot be blank")
    @Size(max = 100, message = "Room name cannot exceed 100 characters")
    private String roomName;

    @Min(value = 1, message = "Capacity must be greater than 0")
    private int capacity;

    @NotNull(message = "Building cannot be null")
    private Building building;
}

