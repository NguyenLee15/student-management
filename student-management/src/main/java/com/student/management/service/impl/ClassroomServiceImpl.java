// cSpell:disable
package com.student.management.service.impl;

import com.student.management.dto.req.ClassroomRequestDto;
import com.student.management.dto.resp.ClassroomResponseDto;
import com.student.management.entity.Classroom;
import com.student.management.enums.Building;
import com.student.management.exception.NotFoundException;
import com.student.management.mapping.ClassroomMapper;
import com.student.management.repository.ClassroomRepository;
import com.student.management.service.ClassroomService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassroomServiceImpl implements ClassroomService {

    private static final Logger logger = LoggerFactory.getLogger(ClassroomServiceImpl.class);

    private final ClassroomRepository classroomRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ClassroomResponseDto> getAll(Pageable pageable) {
        return classroomRepository.findAll(pageable).map(ClassroomMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassroomResponseDto> getAll() {
        return ClassroomMapper.toDtoList(classroomRepository.findAll());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClassroomResponseDto> getByBuilding(Building building) {
        return ClassroomMapper.toDtoList(classroomRepository.findByBuilding(building));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ClassroomResponseDto> searchAndFilter(String keyword, Building building, Pageable pageable) {
        return classroomRepository.searchAndFilter(keyword, building, pageable).map(ClassroomMapper::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassroomResponseDto getById(String roomId) {
        Classroom classroom = classroomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Classroom not found: " + roomId));
        return ClassroomMapper.toDto(classroom);
    }

    @Override
    @Transactional
    public ClassroomResponseDto create(ClassroomRequestDto dto) {
        if (classroomRepository.existsById(dto.getRoomId())) {
            throw new IllegalArgumentException("Room ID already exists: " + dto.getRoomId());
        }
        Classroom classroom = ClassroomMapper.toEntity(dto);
        return ClassroomMapper.toDto(classroomRepository.save(classroom));
    }

    @Override
    @Transactional
    public ClassroomResponseDto update(String roomId, ClassroomRequestDto dto) {
        Classroom classroom = classroomRepository.findById(roomId)
                .orElseThrow(() -> new NotFoundException("Classroom not found: " + roomId));
        classroom.setRoomName(dto.getRoomName());
        classroom.setCapacity(dto.getCapacity());
        classroom.setBuilding(dto.getBuilding());
        return ClassroomMapper.toDto(classroomRepository.save(classroom));
    }

    @Override
    @Transactional
    public void delete(String roomId) {
        if (!classroomRepository.existsById(roomId)) {
            throw new NotFoundException("Classroom not found: " + roomId);
        }
        classroomRepository.deleteById(roomId);
    }

    @Override
    public ByteArrayInputStream exportToExcel(List<ClassroomResponseDto> classrooms) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Classrooms");
            Row header = sheet.createRow(0);
            String[] cols = {"Room ID", "Room Name", "Capacity", "Building"};
            for (int i = 0; i < cols.length; i++) {
                header.createCell(i).setCellValue(cols[i]);
            }
            int idx = 1;
            for (ClassroomResponseDto c : classrooms) {
                Row r = sheet.createRow(idx++);
                r.createCell(0).setCellValue(c.getRoomId() != null ? c.getRoomId() : "");
                r.createCell(1).setCellValue(c.getRoomName() != null ? c.getRoomName() : "");
                r.createCell(2).setCellValue(c.getCapacity());
                r.createCell(3).setCellValue(c.getBuilding() != null ? c.getBuilding().getName() : "");
            }
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Error exporting classroom excel: ", e);
            throw new RuntimeException("Error exporting classroom excel: " + e.getMessage());
        }
    }
}

