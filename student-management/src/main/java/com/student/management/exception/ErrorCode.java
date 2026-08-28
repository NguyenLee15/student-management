// cSpell:disable
package com.student.management.exception;

public enum ErrorCode {
    // Authentication & Authorization
    UNAUTHORIZED("UNAUTHORIZED", "Yêu cầu đăng nhập để truy cập tài nguyên."),
    ACCESS_DENIED("ACCESS_DENIED", "Bạn không có quyền thực hiện thao tác này."),
    USER_NOT_FOUND("USER_NOT_FOUND", "Không tìm thấy thông tin tài khoản người dùng."),
    STUDENT_NOT_FOUND("STUDENT_NOT_FOUND", "Không tìm thấy hồ sơ sinh viên."),
    TEACHER_NOT_FOUND("TEACHER_NOT_FOUND", "Không tìm thấy hồ sơ giảng viên."),

    // Academic & Subject Configuration
    RESOURCE_NOT_FOUND("RESOURCE_NOT_FOUND", "Tài nguyên yêu cầu không tồn tại."),
    INVALID_GRADE_WEIGHT_SUM("INVALID_GRADE_WEIGHT_SUM", "Tổng trọng số các thành phần điểm (Chuyên cần + Giữa kỳ + Cuối kỳ) phải bằng đúng 1.00."),
    INVALID_SCORE_RANGE("INVALID_SCORE_RANGE", "Điểm số thành phần phải nằm trong khoảng hợp lệ từ 0.0 đến 10.0."),
    
    // Course Registration Engine
    REGISTRATION_PERIOD_CLOSED("REGISTRATION_PERIOD_CLOSED", "Đợt đăng ký tín chỉ hiện tại chưa mở hoặc đã kết thúc."),
    REGISTRATION_PREREQUISITE_FAILED("REGISTRATION_PREREQUISITE_FAILED", "Chưa hoàn thành học phần tiên quyết bắt buộc trước khi đăng ký môn này."),
    REGISTRATION_SCHEDULE_CONFLICT("REGISTRATION_SCHEDULE_CONFLICT", "Lớp học phần bị trùng lịch học (thứ hoặc ca học) với lớp khác."),
    REGISTRATION_CREDIT_LIMIT_EXCEEDED("REGISTRATION_CREDIT_LIMIT_EXCEEDED", "Tổng số tín chỉ đăng ký vượt quá giới hạn tối đa cho phép trong học kỳ."),
    REGISTRATION_CLASS_FULL("REGISTRATION_CLASS_FULL", "Lớp học phần đã đủ sĩ số tối đa, không thể tiếp nhận thêm sinh viên."),
    REGISTRATION_DUPLICATE_SUBJECT("REGISTRATION_DUPLICATE_SUBJECT", "Sinh viên đã đăng ký học phần này trong cùng một học kỳ."),
    DUPLICATE_REQUEST_IN_PROGRESS("DUPLICATE_REQUEST_IN_PROGRESS", "Yêu cầu đăng ký đang được xử lý, vui lòng không gửi lại liên tục."),

    // Gradebook & Attendance
    GRADEBOOK_CLASS_LOCKED("GRADEBOOK_CLASS_LOCKED", "Sổ điểm lớp học phần đã bị khóa bởi Phòng Đào tạo, không thể chỉnh sửa."),
    ATTENDANCE_SESSION_CLOSED("ATTENDANCE_SESSION_CLOSED", "Buổi điểm danh đã đóng, không thể sửa đổi."),
    CLASS_NOT_FOUND("CLASS_NOT_FOUND", "Không tìm thấy lớp học phần."),

    // General Validation & Internal Error
    VALIDATION_ERROR("VALIDATION_ERROR", "Dữ liệu yêu cầu không hợp lệ."),
    INTERNAL_SERVER_ERROR("INTERNAL_SERVER_ERROR", "Đã xảy ra lỗi nội bộ máy chủ.");

    private final String code;
    private final String defaultMessage;

    ErrorCode(String code, String defaultMessage) {
        this.code = code;
        this.defaultMessage = defaultMessage;
    }

    public String getCode() {
        return code;
    }

    public String getDefaultMessage() {
        return defaultMessage;
    }
}
