# 🛡️ ANTIGRAVITY AGENT RULES - STUDENT MANAGEMENT (SPRING BOOT 3 & JAVA 21)

File này thiết lập tiêu chuẩn kỹ thuật cấp độ **Senior Software Engineer** cho Antigravity khi làm việc trên dự án này.

---

## 1. Project Architecture & Tech Stack (Kiến trúc & Công nghệ)
- **Language & Framework:** Java 21, Spring Boot 3.4.x, Spring Data JPA, Spring Security 6.x, Spring Validation, Thymeleaf.
- **Package Base:** `com.example.student.management`
- **Layered Architecture:**
  - `controller`: Chỉ nhận HTTP Request, validate DTO (`@Valid`), gọi Service và trả về View/ResponseEntity. Không chứa logic nghiệp vụ hay truy vấn database.
  - `service`: Chứa toàn bộ Business Logic, quản lý giao dịch (`@Transactional`), gọi repository.
  - `repository`: Kế thừa `JpaRepository`, chỉ định nghĩa truy vấn (JPA Query Method hoặc `@Query`).
  - `dto`: Chứa Request/Response models, tách biệt hoàn toàn với `entity`.
  - `mapping`: Chuyển đổi giữa Entity và DTO (tránh lộ Entity ra ngoài Controller).
  - `exception`: Chứa Custom Exceptions và Global Exception Handler (`@ControllerAdvice` / `@RestControllerAdvice`).

---

## 2. Core Engineering Rules (Quy chuẩn kỹ thuật)

### A. Spec-Driven & Model Safety
- Luôn định nghĩa DTO và Validation Annotations (`@NotBlank`, `@Size`, `@Min`, `@Pattern`) trước khi viết Controller/Service.
- Không bao giờ trả trực tiếp JPA Entity ra ngoài View/API để tránh vòng lặp Jackson serialization và nạp dữ liệu thừa (Lazy loading issue).

### B. Security & Configuration
- Không bao giờ hardcode mật khẩu, database credentials, JWT secret trong mã nguồn.
- Mọi cấu hình nhạy cảm phải lấy qua biến môi trường hoặc `application.properties` (`@Value` / `@ConfigurationProperties`).
- Phân quyền rõ ràng qua Spring Security (`hasRole`, `@PreAuthorize`), bảo vệ endpoint chống truy cập trái phép.

### C. Error Handling & Robustness
- Mọi exception phải được xử lý tập trung qua `GlobalExceptionHandler`.
- Trả về mã lỗi HTTP chuẩn (400 Bad Request, 401/403 Unauthorized, 404 Not Found, 500 Internal Server Error) kèm thông điệp lỗi thân thiện.
- Không nuốt lỗi (`catch(Exception e) {}` trống). Luôn log lại lỗi bằng `org.slf4j.Logger` hoặc `@Slf4j`.

### D. Testing & Quality Assurance
- **Unit Test:** Sử dụng JUnit 5 + Mockito cho tầng `service` (mock repository).
- **Controller Test:** Sử dụng `@WebMvcTest` hoặc `MockMvc` để test endpoint, validation và phân quyền.
- **Edge Cases:** Kiểm tra dữ liệu null, chuỗi rỗng, ID không tồn tại, trùng lặp khóa duy nhất (Email/Username/Student Code).

---

## 3. Quy ước làm việc của AI Assistant
1. **Đọc hiểu trước khi sửa:** Kiểm tra `pom.xml`, các Entity và Repository liên quan trước khi sinh code.
2. **Không phá vỡ cấu trúc:** Giữ nguyên các class cấu hình và annotation hiện có, trừ khi được yêu cầu refactor.
3. **Code hoàn chỉnh:** Cung cấp code có đầy đủ imports (`jakarta.*`, `org.springframework.*`), không dùng code placeholder kiểu `// TODO: tự code tiếp`.
