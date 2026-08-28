package com.student.management.service;

import com.student.management.dto.req.TeacherRequestDto;
import com.student.management.dto.resp.TeacherResponseDto;
import com.student.management.entity.Faculty;
import com.student.management.entity.Teacher;
import com.student.management.exception.NotFoundException;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.TeacherRepository;
import com.student.management.service.impl.TeacherServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;

    @Mock
    private FacultyRepository facultyRepository;

    @InjectMocks
    private TeacherServiceImpl teacherService;

    private Faculty faculty;
    private Teacher teacher;
    private TeacherRequestDto requestDto;

    @BeforeEach
    void setUp() {
        faculty = Faculty.builder()
                .facultyId("CNTT")
                .facultyName("Cong Nghe Thong Tin")
                .build();

        teacher = Teacher.builder()
                .teacherId("GV001")
                .fullName("Nguyen Van Thuc")
                .email("thuc@gmail.com")
                .faculty(faculty)
                .build();

        requestDto = TeacherRequestDto.builder()
                .teacherId("GV001")
                .fullName("Nguyen Van Thuc")
                .email("thuc@gmail.com")
                .facultyId("CNTT")
                .build();
    }

    @Test
    @DisplayName("Get Teacher By ID - Success")
    void testGetTeacherByIdSuccess() {
        when(teacherRepository.findById("GV001")).thenReturn(Optional.of(teacher));

        TeacherResponseDto result = teacherService.getById("GV001");

        assertNotNull(result);
        assertEquals("GV001", result.getTeacherId());
        assertEquals("Nguyen Van Thuc", result.getFullName());
    }

    @Test
    @DisplayName("Get Teacher By ID - Not Found Exception")
    void testGetTeacherByIdNotFound() {
        when(teacherRepository.findById("GV999")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> teacherService.getById("GV999"));
    }

    @Test
    @DisplayName("Create Teacher - Success")
    void testCreateTeacherSuccess() {
        when(facultyRepository.findById("CNTT")).thenReturn(Optional.of(faculty));
        when(teacherRepository.save(any(Teacher.class))).thenReturn(teacher);

        TeacherResponseDto result = teacherService.create(requestDto);

        assertNotNull(result);
        assertEquals("GV001", result.getTeacherId());
        verify(teacherRepository, times(1)).save(any(Teacher.class));
    }
}

