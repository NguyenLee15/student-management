# 📋 Feature Specification: [Tên tính năng / Feature Name]

> **Tài liệu này dùng để định hình toàn bộ logic, schema và luồng dữ liệu trước khi viết code.**

---

## 1. Mục tiêu & Nghiệp vụ (Objective & User Stories)
- **Mục tiêu chính:** [Mô tả tính năng làm gì trong 1-2 câu]
- **Người dùng mục tiêu:** [Ai sử dụng tính năng này?]
- **Tiêu chí hoàn thành (Acceptance Criteria):**
  - [ ] Người dùng có thể thực hiện hành động A và nhận kết quả B.
  - [ ] Hệ thống chặn hành động không hợp lệ và hiển thị thông báo lỗi rõ ràng.

---

## 2. Cấu trúc dữ liệu & Data Schema (Data Contracts)
```typescript
// Định nghĩa Types / Interfaces / Schema
export interface RequestPayload {
  id?: string;
  name: string;
  category: string;
  amount: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
```

---

## 3. Luồng dữ liệu & Giao tiếp API (Data Flow)
- **Endpoint:** `POST /api/v1/resource`
- **Quyền truy cập (Auth):** `Bearer Token (Role: Admin / User)`
- **Xử lý trạng thái (State Management):**
  - **Loading:** Hiển thị skeleton / spinner khi đang tải.
  - **Success:** Cập nhật state cục bộ hoặc revalidate cache.
  - **Error:** Hiển thị Toast / Notification lỗi thân thiện.

---

## 4. Kế hoạch phân rã công việc (Task Breakdown)
- [ ] **Phase 1 (Data & Validation):** Tạo Schema, DTO và logic kiểm tra tính hợp lệ dữ liệu.
- [ ] **Phase 2 (Unit Tests):** Viết test case cho các kịch bản thành công và lỗi ngoại lệ.
- [ ] **Phase 3 (Core Service/API):** Viết logic xử lý nghiệp vụ và truy vấn CSDL.
- [ ] **Phase 4 (UI & Integration):** Xây dựng giao diện, kết nối API, xử lý UI states (Loading/Empty/Error).
- [ ] **Phase 5 (Code Review & Security):** Kiểm tra bảo mật, sanitize input và tối ưu hiệu năng.
