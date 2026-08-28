// cSpell:disable
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

    @NotBlank(message = "Mã phòng không được để trống")
    @Size(max = 10, message = "Mã phòng không được vượt quá 10 ký tự")
    private String roomId;

    @NotBlank(message = "Tên phòng không được để trống")
    @Size(max = 100, message = "Tên phòng không được vượt quá 100 ký tự")
    private String roomName;

    @Min(value = 1, message = "Sức chứa phải lớn hơn 0")
    private int capacity;

    @NotNull(message = "Tòa nhà không được để trống")
    private Building building;
}

