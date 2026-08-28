// cSpell:disable
package com.student.management.policy;

import com.student.management.entity.CreditClass;
import com.student.management.entity.Subject;
import com.student.management.exception.BusinessException;
import com.student.management.exception.ErrorCode;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

class SubjectGradePolicyTest {

    @Test
    @DisplayName("Hợp lệ: Tổng trọng số điểm bằng chính xác 1.00")
    void testValidGradeWeightsSum() {
        Subject subject = Subject.builder()
                .subjectId("CS101")
                .subjectName("Nhập môn Lập trình")
                .attendanceWeight(new BigDecimal("0.10"))
                .midtermWeight(new BigDecimal("0.30"))
                .finalExamWeight(new BigDecimal("0.60"))
                .build();

        assertDoesNotThrow(subject::validateGradeWeights);
    }

    @Test
    @DisplayName("Hợp lệ: Trọng số điểm tỷ lệ 20-20-60 bằng chính xác 1.00")
    void testAlternativeValidGradeWeightsSum() {
        Subject subject = Subject.builder()
                .subjectId("CS202")
                .subjectName("Cấu trúc Dữ liệu")
                .attendanceWeight(new BigDecimal("0.20"))
                .midtermWeight(new BigDecimal("0.20"))
                .finalExamWeight(new BigDecimal("0.60"))
                .build();

        assertDoesNotThrow(subject::validateGradeWeights);
    }

    @Test
    @DisplayName("Vi phạm: Tổng trọng số điểm nhỏ hơn 1.00 (0.90) phải ném BusinessException")
    void testInvalidGradeWeightsSumLessThanOne() {
        Subject subject = Subject.builder()
                .subjectId("CS101")
                .subjectName("Nhập môn Lập trình")
                .attendanceWeight(new BigDecimal("0.10"))
                .midtermWeight(new BigDecimal("0.20"))
                .finalExamWeight(new BigDecimal("0.60"))
                .build();

        BusinessException exception = assertThrows(BusinessException.class, subject::validateGradeWeights);
        assertEquals(ErrorCode.INVALID_GRADE_WEIGHT_SUM, exception.getErrorCode());
    }

    @Test
    @DisplayName("Vi phạm: Tổng trọng số điểm lớn hơn 1.00 (1.10) phải ném BusinessException")
    void testInvalidGradeWeightsSumGreaterThanOne() {
        Subject subject = Subject.builder()
                .subjectId("CS101")
                .subjectName("Nhập môn Lập trình")
                .attendanceWeight(new BigDecimal("0.30"))
                .midtermWeight(new BigDecimal("0.30"))
                .finalExamWeight(new BigDecimal("0.50"))
                .build();

        BusinessException exception = assertThrows(BusinessException.class, subject::validateGradeWeights);
        assertEquals(ErrorCode.INVALID_GRADE_WEIGHT_SUM, exception.getErrorCode());
    }

    @Test
    @DisplayName("Snapshot bất biến: Sửa đổi trọng số trên Subject không làm ảnh hưởng trọng số đã snapshot trên CreditClass")
    void testSnapshotImmutabilityOnCreditClass() {
        Subject subject = Subject.builder()
                .subjectId("CS101")
                .attendanceWeight(new BigDecimal("0.10"))
                .midtermWeight(new BigDecimal("0.30"))
                .finalExamWeight(new BigDecimal("0.60"))
                .build();

        CreditClass creditClass = CreditClass.builder()
                .creditClassId(101L)
                .subject(subject)
                .build();
        creditClass.snapshotWeightsFromSubject();

        assertEquals(new BigDecimal("0.10"), creditClass.getAttendanceWeight());
        assertEquals(new BigDecimal("0.30"), creditClass.getMidtermWeight());
        assertEquals(new BigDecimal("0.60"), creditClass.getFinalExamWeight());

        // Thay đổi trọng số Subject cho năm học tiếp theo
        subject.setAttendanceWeight(new BigDecimal("0.20"));
        subject.setMidtermWeight(new BigDecimal("0.20"));
        subject.setFinalExamWeight(new BigDecimal("0.60"));

        // Trọng số trên CreditClass đã tạo kỳ trước vẫn giữ nguyên bản snapshot
        assertEquals(new BigDecimal("0.10"), creditClass.getAttendanceWeight());
        assertEquals(new BigDecimal("0.30"), creditClass.getMidtermWeight());
        assertEquals(new BigDecimal("0.60"), creditClass.getFinalExamWeight());
    }
}

