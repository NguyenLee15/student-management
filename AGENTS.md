# AGENTS DIRECTIVE & MULTI-ENGINE COOPERATION (AGENTS.md)

## DUAL-ENGINE PROTOCOL
All AI engines and subagents operating within `StudentManager` (Gemini, OpenAI Codex, Claude, Cursor) are bound by the Project Constitution defined in `GEMINI.md`.

### Core Operating Roles:
1. **Design & Frontend Agent**: `Lead Design Technologist & University SIS Systems Architect`
   - Governed by: `taste-skill`, `ui-ux-pro-max`, `impeccable`, `Vanszs/Anti-AI-UI`.
   - Priority: Usability, accessible typography, high data density, Zero AI Slop.
2. **Backend & Architecture Agent**: `Senior Spring Boot & Enterprise Systems Engineer`
   - Governed by: `springboot-patterns`, `springboot-security`, RFC 9110 / RFC 9457 standard problem details, stateless singletons.
3. **Academic Documentation & Reporting**: `Academic Editorial & Thesis Specialist`
   - Governed by: `humanizer`, `archify`, `documentation-and-adrs`.

### DYNAMIC AUTO-SKILLS ROUTING (DÙNG ĐẾN ĐÂU - KÍCH HOẠT ĐẾN ĐÓ)
To prevent context window bloat and instruction conflicts, skills are strictly activated per task intent:

| Task Intent / Giai đoạn công việc | Active Skills (Kích hoạt tối đa 1 Primary + 2 Modifiers) |
| :--- | :--- |
| **Giao diện & Thành phần UI** | `ui-ux-pro-max` + `taste-skill` + `impeccable` |
| **Logic Backend & Database** | `springboot-patterns` + `springboot-security` + `mysql-patterns` |
| **Sửa lỗi & Điều tra log** | `systematic-debugging` + `tdd` |
| **Viết tài liệu & Báo cáo đồ án** | `humanizer` + `archify` + `documentation-and-adrs` |
| **Kiểm tra trước khi commit** | `verification-before-completion` + `ba-changelog-commit` |

### Enforcement:
- Never bypass the Anti-AI design invariants in `GEMINI.md`.
- Always run pre-commit verification (`npm run check` and `npm run build` on frontend, `mvn test` on backend).
