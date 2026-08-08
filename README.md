# 🎓 EduPortal AI — Hệ Thống Quản Lý Đào Tạo & Sinh Viên Đại Học

> **Đồ Án Tốt Nghiệp (ĐATN) / Enterprise University Management System**  
> Xây dựng trên nền tảng **Spring Boot 3.4.5 (Java 21) Pure REST API** và **React 18 + Vite + Tailwind CSS SPA**.

---

## 📌 1. Giới Thiệu Tổng Quan

Hệ thống **EduPortal AI** là giải pháp phần mềm quản trị đại học toàn diện, phục vụ công tác quản lý sinh viên, giảng viên, chương trình đào tạo theo hệ thống tín chỉ, thời khóa biểu, xếp phòng học và quản lý điểm số theo chuẩn thang điểm 4.0 và thang điểm chữ (A, B, C, D, F).

### ⚙️ Ngăn Xếp Công Nghệ (Tech Stack)

| Thành phần | Công nghệ sử dụng |
| :--- | :--- |
| **Backend** | Java 21, Spring Boot 3.4.5, Spring Data JPA, Spring Security 6, JWT Stateless, Lombok |
| **Frontend** | React 18, Vite 6, Tailwind CSS 3, Recharts, Lucide React, Axios |
| **Database** | H2 Database (In-Memory cho Dev/Test) & MySQL 8.0 (Production) |
| **API Docs** | Springdoc OpenAPI 3.0 / Swagger UI |
| **Báo cáo & Dữ liệu** | Apache POI 5.3 (Xử lý Import/Export Excel `.xlsx`) |

---

## 🏛️ 2. Kiến Trúc Hệ Thống & Sơ Đồ Thực Thể

```
Client (React 18 SPA) ──(HTTP JSON / JWT Bearer)──> Spring Boot 3 REST API
                                                               │
                     ┌─────────────────────────────────────────┼────────────────────────────────────────┐
                     ▼                                         ▼                                        ▼
             AuthRestController                        StudentRestController                   GradeRestController
                     │                                         │                                        │
             UserServiceImpl                           StudentServiceImpl                       GradeServiceImpl
                     │                                         │                                        │
             UserRepository                            StudentRepository                        GradeRepository
                     │                                         │                                        │
                     └─────────────────────────────────────────┴────────────────────────────────────────┘
                                                               │
                                                               ▼
                                                  JPA / Hibernate (MySQL / H2)
```

---

## 🌐 3. Danh Mục REST API Endpoints (`/api/v1`)

| STT | Phân hệ | Phương thức & URL | Mô tả chức năng |
| :---: | :--- | :--- | :--- |
| **1** | **Xác thực** | `POST /api/v1/auth/login` | Đăng nhập trả về JWT Bearer Token |
| **2** | **Xác thực** | `POST /api/v1/auth/register` | Đăng ký tài khoản người dùng mới |
| **3** | **Sinh viên** | `GET /api/v1/students` | Lấy danh sách SV, phân trang, lọc Khoa/Lớp |
| **4** | **Sinh viên** | `POST /api/v1/students` | Thêm sinh viên mới |
| **5** | **Sinh viên** | `PUT /api/v1/students/{id}` | Cập nhật thông tin sinh viên |
| **6** | **Sinh viên** | `DELETE /api/v1/students/{id}` | Xóa sinh viên khỏi hệ thống |
| **7** | **Sinh viên** | `GET /api/v1/students/export` | Xuất danh sách sinh viên ra file Excel `.xlsx` |
| **8** | **Sinh viên** | `POST /api/v1/students/import` | Nhập danh sách sinh viên từ file Excel |
| **9** | **Giảng viên** | `GET /api/v1/teachers` | Lấy danh sách giảng viên, tìm kiếm theo tên/khoa |
| **10** | **Giảng viên** | `POST /api/v1/teachers` | Thêm giảng viên mới |
| **11** | **Khoa** | `GET /api/v1/faculties` | Lấy danh sách các khoa đào tạo |
| **12** | **Khóa học** | `GET /api/v1/academic-years` | Quản lý niên khóa (K64, K65, K66...) |
| **13** | **Lớp học** | `GET /api/v1/student-classes` | Quản lý lớp sinh viên theo từng khoa |
| **14** | **Học phần** | `GET /api/v1/subjects` | Quản lý môn học, số tín chỉ, lý thuyết, thực hành |
| **15** | **Phòng học** | `GET /api/v1/classrooms` | Quản lý phòng học theo Tòa (A, B, C, D) |
| **16** | **Lớp tín chỉ** | `GET /api/v1/credit-classes` | Quản lý lớp tín chỉ, hạn ngạch sinh viên |
| **17** | **Lớp tín chỉ** | `POST /api/v1/credit-classes/{id}/students/{studentId}` | Đăng ký sinh viên vào lớp tín chỉ |
| **18** | **Thời khóa biểu** | `GET /api/v1/semester-schedules` | Quản lý ca học (1-5), thứ trong tuần, phòng |
| **19** | **Điểm số** | `GET /api/v1/academic-grades` | Quản lý điểm CC, TX, Thi, tính GPA 4.0 và Điểm Chữ |
| **20** | **Tài khoản** | `GET /api/v1/users` | Quản lý tài khoản và phân quyền `ADMIN` / `TEACHER` |

---

## 🔑 4. Tài Khoản Mặc Định

Hệ thống được cấu hình `DataInitializer` tự động tạo sẵn 2 tài khoản quản trị khi khởi động:

| Username | Password | Vai trò (Role) | Quyền hạn |
| :--- | :--- | :--- | :--- |
| **`admin`** | **`admin123`** | `ROLE_ADMIN` | Quản trị toàn quyền hệ thống, tài khoản, cấu hình |
| **`teacher`** | **`teacher123`** | `ROLE_TEACHER` | Quản lý sinh viên, nhập điểm, xem lịch dạy |

---

## 🚀 5. Hướng Dẫn Khởi Chạy

### Cách 1: Khởi chạy 1-Click (Khuyên dùng trên Windows)
Chỉ cần nhấp đúp chuột vào file:
```cmd
start-all.bat
```
*(File này sẽ tự động bật Spring Boot Backend, Vite Frontend và mở trình duyệt tại `http://localhost:3000`).*

---

### Cách 2: Khởi chạy thủ công từng phần

#### Bước 1: Khởi chạy Backend (Spring Boot)
```bash
cd D:\DATN\StudentManager\student-management
mvn spring-boot:run
```
* Backend API: `http://localhost:8080/api/v1`
* Swagger UI Docs: `http://localhost:8080/swagger-ui/index.html`

#### Bước 2: Khởi chạy Frontend (React + Vite)
```bash
cd D:\DATN\StudentManager\student-management-frontend
npm run dev
```
* Truy cập Web: `http://localhost:3000`

---

## 🧪 6. Kiểm Thử & Đóng Gói (Build)

### Kiểm thử Backend:
```bash
cd D:\DATN\StudentManager\student-management
mvn clean test
mvn clean package -DskipTests
```

### Đóng gói Frontend:
```bash
cd D:\DATN\StudentManager\student-management-frontend
npm run build
```
