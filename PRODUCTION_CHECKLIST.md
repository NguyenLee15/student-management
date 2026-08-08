# ✅ Spring Boot Production Readiness Checklist

Checklist đánh giá toàn diện trước khi deploy hoặc merge mã nguồn:

---

### 1. Bảo mật & Quản lý môi trường (Security & Config)
- [ ] Không có password database (MySQL/PostgreSQL) hay JWT secret bị hardcode trong `application.properties`.
- [ ] Các endpoint quản trị (`/api/admin/**`, `/actuator/**`) được cấu hình phân quyền nghiêm ngặt trong `SecurityFilterChain`.
- [ ] Đã bật CSRF protection (với form submit Thymeleaf) hoặc cấu hình CORS an toàn (nếu dùng REST API).
- [ ] Có file `.gitignore` loại trừ thư mục `target/`, `.mvn/`, file `.env` hoặc file cấu hình nhạy cảm.

---

### 2. Tầng Dữ liệu & Transaction (JPA & Database)
- [ ] Các phương thức ghi/sửa dữ liệu trong Service đều có `@Transactional`.
- [ ] Tránh lỗi N+1 Query bằng cách sử dụng `JOIN FETCH` hoặc `@EntityGraph` khi truy vấn quan hệ (`@OneToMany`, `@ManyToOne`).
- [ ] Bổ sung Database Index cho các cột thường xuyên tìm kiếm (vd: `student_code`, `email`, `created_at`).

---

### 3. Tầng Điều khiển & Xử lý lỗi (Controller & Exception)
- [ ] Mọi input request đều có `@Valid` và bắt `MethodArgumentNotValidException` trong `@ControllerAdvice`.
- [ ] Không trả stack trace chi tiết ra cho người dùng cuối khi gặp lỗi 500.
- [ ] Xử lý đầy đủ các lỗi 404 (ResourceNotFoundException) và 409 (DataIntegrityViolationException / Trùng dữ liệu).

---

### 4. Kiểm thử & Vận hành (Testing & Observability)
- [ ] Đã chạy `mvn clean test` và tất cả các Unit/Integration test đều PASS.
- [ ] Ghi log có cấu trúc bằng `LoggerFactory` (DEBUG cho dev, INFO/ERROR cho production).
- [ ] Tích hợp Spring Boot Actuator (`/actuator/health`) để kiểm tra trạng thái hoạt động của hệ thống.
