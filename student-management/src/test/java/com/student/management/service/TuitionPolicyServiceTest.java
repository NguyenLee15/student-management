// cSpell:disable
package com.student.management.service;

import com.student.management.dto.req.TuitionPolicyRequestDto;
import com.student.management.dto.resp.TuitionPolicyResponseDto;
import com.student.management.entity.*;
import com.student.management.repository.FacultyRepository;
import com.student.management.repository.SemesterRepository;
import com.student.management.repository.TuitionPolicyRepository;
import com.student.management.service.impl.TuitionPolicyServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TuitionPolicyServiceTest {

    @Mock
    private TuitionPolicyRepository tuitionPolicyRepository;

    @Mock
    private SemesterRepository semesterRepository;

    @Mock
    private FacultyRepository facultyRepository;

    @InjectMocks
    private TuitionPolicyServiceImpl tuitionPolicyService;

    private Semester sampleSemester;
    private Faculty sampleFaculty;
    private Student sampleStudent;
    private CreditClass sampleClass;

    @BeforeEach
    void setUp() {
        sampleFaculty = Faculty.builder()
                .facultyId("CNTT")
                .facultyName("Công nghệ Thông tin")
                .build();

        sampleSemester = Semester.builder()
                .id(1L)
                .name("Học kỳ 1 2026-2027")
                .semesterCode("20261")
                .build();

        StudentClass studentClass = StudentClass.builder()
                .classId("CNTT01")
                .faculty(sampleFaculty)
                .build();

        sampleStudent = Student.builder()
                .studentId("SV2026001")
                .fullName("Nguyễn Văn A")
                .studentClass(studentClass)
                .build();

        Subject subject = Subject.builder()
                .subjectId("CS101")
                .subjectName("Nhập môn Lập trình")
                .tuitionPerCredit(450000)
                .build();

        sampleClass = CreditClass.builder()
                .creditClassId(101L)
                .semester(sampleSemester)
                .subject(subject)
                .build();
    }

    @Test
    @DisplayName("Ưu tiên 1: Lấy đơn giá theo chính sách riêng của Khoa CNTT")
    void testGetEffectiveUnitPriceFacultySpecific() {
        TuitionPolicy facultyPolicy = TuitionPolicy.builder()
                .id(1L)
                .semester(sampleSemester)
                .faculty(sampleFaculty)
                .unitPricePerCredit(new BigDecimal("550000.00"))
                .effectiveDate(LocalDate.of(2026, 9, 1))
                .active(true)
                .build();

        when(tuitionPolicyRepository.findFacultySpecificPolicy(eq(1L), eq("CNTT"), any(LocalDate.class)))
                .thenReturn(List.of(facultyPolicy));

        BigDecimal price = tuitionPolicyService.getEffectiveUnitPrice(sampleStudent, sampleClass, LocalDate.now());
        assertEquals(new BigDecimal("550000.00"), price);
    }

    @Test
    @DisplayName("Ưu tiên 2: Fallback về chính sách chung toàn trường khi Khoa không có chính sách riêng")
    void testGetEffectiveUnitPriceUniversityWideFallback() {
        TuitionPolicy universityPolicy = TuitionPolicy.builder()
                .id(2L)
                .semester(sampleSemester)
                .faculty(null)
                .unitPricePerCredit(new BigDecimal("480000.00"))
                .effectiveDate(LocalDate.of(2026, 9, 1))
                .active(true)
                .build();

        when(tuitionPolicyRepository.findFacultySpecificPolicy(eq(1L), eq("CNTT"), any(LocalDate.class)))
                .thenReturn(List.of());
        when(tuitionPolicyRepository.findUniversityWidePolicy(eq(1L), any(LocalDate.class)))
                .thenReturn(List.of(universityPolicy));

        BigDecimal price = tuitionPolicyService.getEffectiveUnitPrice(sampleStudent, sampleClass, LocalDate.now());
        assertEquals(new BigDecimal("480000.00"), price);
    }

    @Test
    @DisplayName("Ưu tiên 3: Fallback về đơn giá mặc định của Subject khi không có TuitionPolicy nào")
    void testGetEffectiveUnitPriceSubjectDefaultFallback() {
        when(tuitionPolicyRepository.findFacultySpecificPolicy(eq(1L), eq("CNTT"), any(LocalDate.class)))
                .thenReturn(List.of());
        when(tuitionPolicyRepository.findUniversityWidePolicy(eq(1L), any(LocalDate.class)))
                .thenReturn(List.of());

        BigDecimal price = tuitionPolicyService.getEffectiveUnitPrice(sampleStudent, sampleClass, LocalDate.now());
        assertEquals(new BigDecimal("450000"), price);
    }

    @Test
    @DisplayName("Tạo mới biểu phí học phí: Lưu thành công")
    void testCreatePolicySuccess() {
        TuitionPolicyRequestDto requestDto = TuitionPolicyRequestDto.builder()
                .semesterId(1L)
                .facultyId("CNTT")
                .unitPricePerCredit(new BigDecimal("520000.00"))
                .effectiveDate(LocalDate.now())
                .active(true)
                .build();

        when(semesterRepository.findById(1L)).thenReturn(Optional.of(sampleSemester));
        when(facultyRepository.findById("CNTT")).thenReturn(Optional.of(sampleFaculty));
        when(tuitionPolicyRepository.save(any(TuitionPolicy.class))).thenAnswer(i -> {
            TuitionPolicy p = i.getArgument(0);
            p.setId(99L);
            return p;
        });

        TuitionPolicyResponseDto response = tuitionPolicyService.createPolicy(requestDto);
        assertNotNull(response);
        assertEquals(99L, response.getId());
        assertEquals(new BigDecimal("520000.00"), response.getUnitPricePerCredit());
        assertEquals("KHOA Công nghệ Thông tin", response.getScope());
    }
}

