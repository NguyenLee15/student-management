# 💡 AI Prompt Cheatsheet (Bộ Câu Lệnh Mẫu Chuẩn Kỹ Sư)

Sao chép và tùy biến các câu lệnh này khi làm việc với AI để nhận được chất lượng code tốt nhất.

---

### 1. Prompt Phân rã bài toán (Decomposition Prompt)
```text
Tôi muốn xây dựng tính năng [tên tính năng]. 
Yêu cầu bạn đóng vai trò là một Senior Software Architect:
1. Đừng vội viết code logic ngay.
2. Hãy phân tích cấu trúc thư mục, các Data Types/Interfaces cần thiết.
3. Chia việc triển khai thành 4-5 bước nhỏ (từ Data Schema -> Business Logic -> API -> UI) theo thứ tự phụ thuộc.
4. Liệt kê các rủi ro kỹ thuật hoặc edge cases cần lưu ý.
```

---

### 2. Prompt Yêu cầu viết Test trước (TDD Prompt)
```text
Dựa trên Data Schema và yêu cầu sau: [Mô tả yêu cầu hàm/service]
Hãy viết bộ Unit Test sử dụng [Jest / Vitest / JUnit / PyTest] bao gồm:
- 1 trường hợp chạy thành công (Happy Path).
- 2 trường hợp dữ liệu biên (Edge cases: rỗng, số 0, chuỗi quá dài).
- 2 trường hợp dữ liệu không hợp lệ hoặc lỗi mạng (Error cases).
```

---

### 3. Prompt Đóng vai trò Tech Lead Review Code (Code Review Prompt)
```text
Hãy đóng vai trò là một Tech Lead rất khó tính. Hãy review đoạn code dưới đây và chỉ ra:
1. Có lỗ hổng bảo mật nào không (SQL injection, XSS, lộ credential, thiếu auth)?
2. Có vấn đề về hiệu năng hoặc memory leak / re-render thừa không?
3. Có trường hợp nào code sẽ bị crash do null/undefined không?
4. Đưa ra phiên bản code đã được tối ưu và giải thích lý do thay đổi.

[Dán code của bạn vào đây]
```

---

### 4. Prompt Xử lý lỗi & Debug có phương pháp (Systematic Debugging)
```text
Tôi gặp lỗi sau: [Dán mã lỗi / log lỗi].
Ngữ cảnh: [Mô tả khi nào lỗi xảy ra].
Hãy phân tích theo các bước:
1. Nguyên nhân gốc rễ (Root Cause) của lỗi này là gì?
2. Có những giả định nào về dữ liệu đầu vào bị sai?
3. Cung cấp giải pháp sửa lỗi triệt để, không sửa kiểu chắp vá (monkey patch).
```
