// cSpell:disable
package com.student.management.mapping;

import com.student.management.dto.req.ClassroomRequestDto;
import com.student.management.dto.resp.ClassroomResponseDto;
import com.student.management.entity.Classroom;

import java.util.List;
import java.util.stream.Collectors;

public class ClassroomMapper {

    public static Classroom toEntity(ClassroomRequestDto dto) {
        return Classroom.builder()
                .roomId(dto.getRoomId())
                .roomName(dto.getRoomName())
                .capacity(dto.getCapacity())
                .building(dto.getBuilding())
                .build();
    }

    public static ClassroomResponseDto toDto(Classroom classroom) {
        if (classroom == null) return null;
        return ClassroomResponseDto.builder()
                .roomId(classroom.getRoomId())
                .roomName(classroom.getRoomName())
                .capacity(classroom.getCapacity())
                .building(classroom.getBuilding())
                .build();
    }

    public static List<ClassroomResponseDto> toDtoList(List<Classroom> list) {
        if (list == null) return List.of();
        return list.stream().map(ClassroomMapper::toDto).collect(Collectors.toList());
    }
}

