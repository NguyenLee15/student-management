// cSpell:disable
package com.student.management.dto.resp;

import com.student.management.enums.Building;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ClassroomResponseDto {
    private String roomId;
    private String roomName;
    private int capacity;
    private Building building;
}

