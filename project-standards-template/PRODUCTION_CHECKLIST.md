# ✅ Production Readiness Checklist (Bảng Kiểm Tra Bàn Giao Sản Phẩm)

Sử dụng checklist này trước khi merge code vào nhánh `main` hoặc triển khai sản phẩm thực tế.

---

### 1. Bảo mật & Biến môi trường (Security & Config)
- [ ] Không có API Key, Secret Token hoặc Database Password nào bị hardcode trong mã nguồn.
- [ ] Có file `.env.example` liệt kê đầy đủ các biến môi trường cần thiết kèm mô tả.
- [ ] Toàn bộ input từ người dùng đều được sanitize để chống XSS và SQL Injection.
- [ ] Các API nhạy cảm đều có cơ chế Authentication / Authorization chặt chẽ.
- [ ] File `.gitignore` đã chặn các file nhạy cảm (`.env`, `node_modules`, `build/`, `.idea/`,...).

---

### 2. Xử lý ngoại lệ & Tính ổn định (Robustness & Error Handling)
- [ ] Mọi API call đều có cơ chế `try-catch` hoặc xử lý error state rõ ràng.
- [ ] Xử lý đầy đủ 4 trạng thái giao diện: **Loading (Đang tải)**, **Empty (Dữ liệu rỗng)**, **Success (Thành công)**, **Error (Lỗi)**.
- [ ] Không có các lỗi crash ứng dụng do `undefined is not a function` hoặc `null pointer exception`.
- [ ] Có thông báo lỗi dễ hiểu cho người dùng cuối (tránh hiển thị trực tiếp raw stack trace).

---

### 3. Kiểm thử & Chất lượng mã nguồn (Testing & Code Quality)
- [ ] Các hàm xử lý tính toán hoặc logic nghiệp vụ quan trọng đều có Unit Test.
- [ ] Đã chạy linter / formatter (vd: `npm run lint`, `eslint`, `prettier`) không còn cảnh báo nghiêm trọng.
- [ ] Xóa bỏ toàn bộ các dòng `console.log` thừa, `TODO` chưa giải quyết hoặc đoạn code rác (dead code).
- [ ] TypeScript không còn lỗi type error (nếu dùng TypeScript).

---

### 4. Hiệu năng & Khả năng mở rộng (Performance & Optimization)
- [ ] Không có các vòng lặp re-render vô tận trong UI.
- [ ] Các câu truy vấn CSDL lớn có đánh Index thích hợp và tránh lỗi N+1 Query.
- [ ] Tài nguyên ảnh, video, icon đã được nén tối ưu dung lượng.
- [ ] Có cơ chế debounce / throttle cho các ô tìm kiếm (Search input).
