# 🚀 Hướng Dẫn Sử Dụng Bộ Khung Chuẩn Dự Án (Project Standards Template)

Bộ tài liệu này được thiết kế để áp dụng tư duy **Senior AI-Augmented Engineering** vào mọi dự án của bạn (Frontend, Backend, Mobile, Fullstack), giúp loại bỏ hoàn toàn các rủi ro của việc "vibe-coding" thiếu kiểm soát.

---

## 📂 Danh mục các file trong thư mục này:

1. **`AGENTS.md`** & **`.cursorrules`**:
   - File cấu hình cho các AI Assistant (Cursor, Claude Code, Copilot, ChatGPT,...).
   - Đặt ở thư mục gốc (root) của bất kỳ dự án nào để AI luôn tuân thủ quy tắc bảo mật, kiến trúc và kiểm thử.
2. **`SPEC_TEMPLATE.md`**:
   - Mẫu tài liệu đặc tả tính năng (Spec / PRD thu nhỏ).
   - Điền nhanh vào file này trước khi yêu cầu AI viết code cho bất kỳ tính năng nào.
3. **`PRODUCTION_CHECKLIST.md`**:
   - Bảng kiểm tra chất lượng (Bảo mật, Hiệu năng, Xử lý lỗi, UI/UX) trước khi bàn giao hoặc đẩy code lên Production.
4. **`PROMPT_CHEATSHEET.md`**:
   - Tổng hợp các câu lệnh mẫu (Prompts) đóng vai trò Tech Lead, phân rã bài toán và yêu cầu AI viết Unit Test.
5. **`WORKFLOW.md`**:
   - Quy trình làm việc 5 bước chuẩn hóa từ khâu lên ý tưởng đến khi hoàn thiện sản phẩm.

---

## ⚡ Cách Copy & Áp dụng cho Dự án mới:

1. **Cách 1: Sao chép cả thư mục**
   - Copy toàn bộ nội dung trong thư mục `project-standards-template` vào thư mục gốc của dự án mới.

2. **Cách 2: Sử dụng nhanh file `AGENTS.md` / `.cursorrules`**
   - Chỉ cần copy file `AGENTS.md` (hoặc `.cursorrules`) vào thư mục gốc của dự án bạn đang làm việc.
