package com.example.student.management.service;

import com.example.student.management.dto.req.StudentRequestDto;
import com.example.student.management.dto.resp.StudentResponseDto;
import com.example.student.management.entity.AcademicYear;
import com.example.student.management.entity.Student;
import com.example.student.management.entity.StudentClass;
import com.example.student.management.enums.Gender;
import com.example.student.management.exception.NotFoundException;
import com.example.student.management.repository.AcademicYearRepository;
import com.example.student.management.repository.StudentClassRepository;
import com.example.student.management.repository.StudentRepository;
import com.example.student.management.service.impl.StudentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private StudentClassRepository studentClassRepository;

    @Mock
    private AcademicYearRepository academicYearRepository;

    @InjectMocks
    private StudentServiceImpl studentService;

    private Student student;
    private StudentClass studentClass;
    private AcademicYear academicYear;
    private StudentRequestDto requestDto;

    @BeforeEach
    void setUp() {
        academicYear = AcademicYear.builder()
                .academicYearId("K65")
                .startYear(2020)
                .endYear(2024)
                .build();

        studentClass = StudentClass.builder()
                .classId("CNTT1-K65")
                .className("CNTT 1")
                .build();

        student = Student.builder()
                .studentId("SV2026001")
                .fullName("Le Van Nguyen")
                .email("nguyen2004hd@gmail.com")
                .gender(Gender.MALE)
                .dateOfBirth(LocalDate.of(2004, 8, 15))
                .studentClass(studentClass)
                .academicYear(academicYear)
                .build();

        requestDto = StudentRequestDto.builder()
                .studentId("SV2026001")
                .fullName("Le Van Nguyen")
                .email("nguyen2004hd@gmail.com")
                .gender(Gender.MALE)
                .dateOfBirth(LocalDate.of(2004, 8, 15))
                .classId("CNTT1-K65")
                .academicYearId("K65")
                .build();
    }

    @Test
    @DisplayName("Test getById success")
    void testGetByIdSuccess() {
        when(studentRepository.findById("SV2026001")).thenReturn(Optional.of(student));

        StudentResponseDto response = studentService.getById("SV2026001");

        assertNotNull(response);
        assertEquals("SV2026001", response.getStudentId());
        assertEquals("Le Van Nguyen", response.getFullName());
        verify(studentRepository, times(1)).findById("SV2026001");
    }

    @Test
    @DisplayName("Test getById throws NotFoundException when student missing")
    void testGetByIdNotFound() {
        when(studentRepository.findById("INVALID")).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> studentService.getById("INVALID"));
        verify(studentRepository, times(1)).findById("INVALID");
    }

    @Test
    @DisplayName("Test create student success")
    void testCreateStudentSuccess() {
        when(studentClassRepository.findById("CNTT1-K65")).thenReturn(Optional.of(studentClass));
        when(academicYearRepository.findById("K65")).thenReturn(Optional.of(academicYear));
        when(studentRepository.save(any(Student.class))).thenReturn(student);

        StudentResponseDto response = studentService.create(requestDto);

        assertNotNull(response);
        assertEquals("SV2026001", response.getStudentId());
        verify(studentRepository, times(1)).save(any(Student.class));
    }
}
