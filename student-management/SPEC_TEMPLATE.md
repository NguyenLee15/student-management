# 📋 Feature Specification: [Tên tính năng Spring Boot]

> **Tài liệu đặc tả nghiệp vụ & dữ liệu trước khi triển khai code.**

---

## 1. Mục tiêu & User Story (Business Objective)
- **Tính năng:** [Ví dụ: Thêm mới sinh viên / Xuất danh sách Excel / Phân quyền giảng viên]
- **Yêu cầu nghiệp vụ:**
  - [ ] Validate dữ liệu đầu vào: Email không trùng, Mã sinh viên đúng định dạng.
  - [ ] Lưu trữ vào Database thông qua Transaction an toàn.
  - [ ] Ghi log hành động tạo mới.

---

## 2. Data Contract (DTOs & Validation)

```java
package com.example.student.management.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class StudentRequestDTO {
    @NotBlank(message = "Mã sinh viên không được để trống")
    @Pattern(regexp = "^SV[0-9]{6}$", message = "Mã sinh viên phải có dạng SV123456")
    private String studentCode;

    @NotBlank(message = "Họ tên không được để trống")
    @Size(max = 100, message = "Họ tên tối đa 100 ký tự")
    private String fullName;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Email không được để trống")
    private String email;
}
```

---

## 3. API Contract & URL Mappings
- **Method & Path:** `POST /api/students` hoặc `POST /students/save` (Thymeleaf)
- **Role yêu cầu:** `hasRole('ADMIN')` hoặc `hasRole('MANAGER')`
- **Response Success (200 / 201):** `StudentResponseDTO`
- **Response Error (400 / 409):** `ApiErrorResponse { message, errors, timestamp }`

---

## 4. Kế hoạch phân rã 5 bước (Task Breakdown)
- [ ] **Bước 1:** Tạo `DTO` kèm validation annotations và `Mapper`.
- [ ] **Bước 2:** Viết Unit Test cho `StudentServiceTest` với JUnit 5 & Mockito.
- [ ] **Bước 3:** Cài đặt logic trong `StudentService` & `StudentRepository` (`@Transactional`).
- [ ] **Bước 4:** Xây dựng `StudentController` kết nối Service và xử lý View / REST Response.
- [ ] **Bước 5:** Kiểm tra lại với `PRODUCTION_CHECKLIST.md`.
