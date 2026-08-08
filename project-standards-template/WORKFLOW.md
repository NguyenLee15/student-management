# 🔄 Universal 5-Step AI-Engineering Workflow (Quy Trình 5 Bước)

Quy trình chuẩn hóa áp dụng cho tất cả các tính năng hoặc dự án mới:

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ 1. SPEC & MODEL │ ───> │ 2. DECOMPOSITION│ ───> │ 3. TDD / TESTS  │ ───> │ 4. IMPLEMENT    │ ───> │ 5. VERIFICATION │
│ Định nghĩa      │      │ Phân rã bài toán│      │ Viết test trước │      │ Viết code từng  │      │ Đánh giá với    │
│ Schema/Contract │      │ thành task nhỏ  │      │ hoặc song song  │      │ module nhỏ      │      │ Checklist       │
└─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘
```

---

### Bước 1: Spec & Data Model (Định hình)
- Điền nhanh các thông tin cốt lõi vào file `SPEC_TEMPLATE.md`.
- Chốt trước Data Types, Request/Response format và Validation rules.

### Bước 2: Decomposition (Phân rã)
- Chia nhỏ tính năng thành các module độc lập.
- Không để AI sinh code toàn bộ ứng dụng trong một lần prompt duy nhất.

### Bước 3: Test-Driven Development (Kiểm thử)
- Định nghĩa các kịch bản test (Test cases) với AI.
- Test sẽ là hàng rào bảo vệ vững chắc để đảm bảo logic không bị lỗi âm thầm.

### Bước 4: Implementation (Triển khai)
- Cho AI viết code lần lượt cho từng task đã phân rã.
- Lập trình viên đóng vai trò Tech Lead: đọc hiểu từng dòng code, kiểm tra tính logic và chuẩn kiến trúc.

### Bước 5: Verification & Production Checklist (Nghiệm thu)
- Chạy test và linter.
- Đối chiếu với file `PRODUCTION_CHECKLIST.md` trước khi bàn giao sản phẩm.
