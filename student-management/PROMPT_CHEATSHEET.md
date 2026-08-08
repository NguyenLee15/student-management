# 💡 Prompt Cheatsheet Cho Lập Trình Viên Spring Boot & Fullstack

Sử dụng các câu lệnh này trong Antigravity để điều phối AI làm việc chuẩn chỉ theo tư duy Senior Engineer:

---

### 1. Prompt Phân rã tính năng mới (Feature Architecture)
```text
Tôi muốn xây dựng tính năng [tên tính năng] cho hệ thống quản lý sinh viên.
Hãy đóng vai trò là một Senior Spring Boot Architect:
1. Đừng viết code vội.
2. Hãy phân tích cấu trúc các package liên quan (entity, dto, repository, service, controller).
3. Đề xuất Data Model, Validation rules và chia các bước thực hiện tuần tự.
4. Nêu rõ các rủi ro (lỗi N+1, concurrency, trùng lặp dữ liệu) cần phòng ngừa.
```

---

### 2. Prompt Viết Unit Test cho tầng Service (TDD Prompt)
```text
Dựa trên interface [TênService] và DTO [TênDTO], hãy viết bộ Unit Test hoàn chỉnh sử dụng JUnit 5, Mockito và AssertJ:
- Test case 1: Tạo mới thành công khi dữ liệu hợp lệ (Happy path).
- Test case 2: Ném ngoại lệ DuplicateResourceException khi mã sinh viên/email đã tồn tại.
- Test case 3: Ném ngoại lệ ResourceNotFoundException khi ID tìm kiếm không có trong DB.
- Kiểm tra verify() để đảm bảo repository.save() chỉ được gọi đúng lúc.
```

---

### 3. Prompt Rà soát bảo mật & Spring Security (Security Review)
```text
Hãy đóng vai trò là một Security Expert rà soát cấu hình SecurityFilterChain và Controller dưới đây:
1. Các endpoint nhạy cảm đã được bảo vệ đúng vai trò (hasRole) chưa?
2. Có nguy cơ bị lỗi CSRF, IDOR (Insecure Direct Object Reference) hoặc SQL Injection không?
3. Đề xuất bản vá code an toàn và giải thích lý do.
```
