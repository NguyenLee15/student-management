# 🎓 EduPortal — Enterprise University Academic & Student Management System

<div align="center">

![Java 21](https://img.shields.io/badge/Java-21-orange?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)
![React 18](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6.4-purple?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![PayOS](https://img.shields.io/badge/VietQR-PayOS-0052CC?style=for-the-badge&logo=cashapp&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-42%2F42%20Passing-success?style=for-the-badge&logo=checkmarx&logoColor=white)

**An enterprise-grade, high-concurrency university management platform engineered for modern higher education institutions.**  
*Built with Spring Boot 3, Java 21, React 18 SPA, and production-ready microservices-inspired Clean Architecture.*

[Key Features](#-core-portals--business-capabilities) • [Architecture](#-system-architecture--engineering-highlights) • [Technical Deep-Dives](#-enterprise-engineering-deep-dives) • [Quick Start](#-quick-start--installation) • [API & Swagger](#-api-specification--documentation)

</div>

---

## 🌟 1. Executive Summary

**EduPortal** is an end-to-end University Academic and Student Information Management ERP. It solves critical challenges faced by higher education institutions:
- **Registration Race Conditions:** Eliminates over-enrollment during peak course registration through pessimistic database locking.
- **National Educational Compliance:** Full compliance with the Vietnamese Ministry of Education regulations (**Thông tư 08/2021/TT-BGDĐT**) for 10-point, 4-point GPA, and alphabetical grading (A, B, C, D, F).
- **Fintech Integration:** Automated real-time tuition fee billing, VietQR payment generation, and webhook reconciliation powered by **PayOS**.
- **Role-Based Workflows:** Three dedicated, decoupled portals tailored for **Administrators**, **Lecturers/Teachers**, and **Students**.
- **Defense-in-Depth Security:** Record-level access control eliminating IDOR (Insecure Direct Object Reference) vulnerabilities, coupled with stateless JWT and Refresh Token rotation.

---

## 🏛️ 2. System Architecture & Engineering Highlights

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Client Presentation Layer                         │
│             React 18 SPA + Vite 6 + Tailwind CSS + Lucide + Recharts        │
├─────────────────────────────────────────────────────────────────────────────┤
│                           API Gateway / Reverse Proxy                       │
│                       Nginx 1.25 (Rate Limiting, Gzip, SSL)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                          Application Layer (Spring Boot 3)                  │
│                                                                             │
│  ┌───────────────────────┐ ┌──────────────────────┐ ┌────────────────────┐  │
│  │   Admin Controllers   │ │  Teacher Controllers │ │ Student Controllers│  │
│  └──────────┬────────────┘ └──────────┬───────────┘ └─────────┬──────────┘  │
│             │                         │                       │             │
│  ┌──────────▼─────────────────────────▼───────────────────────▼──────────┐  │
│  │ Security Filter Chain: JWT Stateless, BCrypt, Method-level Security   │  │
│  │ Record-Level Access Control (SecurityService: anti-IDOR checks)       │  │
│  └────────────────────────────────────┬──────────────────────────────────┘  │
│                                       │                                     │
│  ┌────────────────────────────────────▼──────────────────────────────────┐  │
│  │ Business Service Layer: Transaction Boundaries (@Transactional)       │  │
│  │ Registration Engine, Grading Engine (TT08), PayOS Reconciliation      │  │
│  └────────────────────────────────────┬──────────────────────────────────┘  │
│                                       │                                     │
│  ┌────────────────────────────────────▼──────────────────────────────────┐  │
│  │ Data Access Layer: Spring Data JPA + Hibernate 6                      │  │
│  │ Optimized JPQL, JOIN FETCH (Zero N+1), Pessimistic/Optimistic Locks   │  │
│  └────────────────────────────────────┬──────────────────────────────────┘  │
├───────────────────────────────────────┴─────────────────────────────────────┤
│                          Database & Persistence Layer                       │
│         MySQL 8.0 (InnoDB) + Flyway Migrations (V1 to V18)                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 👥 3. Core Portals & Business Capabilities

### 🛡️ A. Administrative Portal (`ROLE_ADMIN`)
* **Executive Dashboard:** Real-time KPI cards, student enrollment trends, tuition collection ratios, and academic warning alerts.
* **Academic Foundation:** Full CRUD and hierarchical management of Faculties, Academic Years (K64, K65...), Student Classes, Classrooms, and Subjects with prerequisite constraints.
* **Credit Class Scheduling:** Create course offerings, allocate lecturer schedules, classroom capacities, and configure score weightings (Attendance, Midterm, Final Exam).
* **Tuition & Policy Management:** Define credit price policies per faculty/academic year, generate student invoices, and audit transactions.
* **Bulk Operations & Excel Processing:** High-performance asynchronous import/export of students, lecturers, and grades using Apache POI.
* **Security & Audit Logs:** Trace administrative actions with IP addresses, timestamps, and contextual metadata.

### 👨‍🏫 B. Faculty & Lecturer Portal (`ROLE_TEACHER`)
* **Assigned Class Overview:** View all assigned credit classes, enrolled student counts, and schedule details.
* **Intelligent Gradebook:** Enter and update Attendance, Midterm, and Final Exam scores with automatic real-time calculation of overall score (scale 10), letter grade (A/B/C/D/F), scale 4.0, and pass/fail evaluation.
* **Statistical Insights:** Interactive bar charts illustrating score distribution curves (A, B, C, D, F) to identify class academic performance.
* **Teaching Timetable:** Weekly schedule view categorized by classroom, day of the week, and period slots.

### 👨‍🎓 C. Student Self-Service Portal (`ROLE_STUDENT`)
* **Live Course Registration:**
  - View open registration periods, search available credit classes with real-time remaining capacity.
  - Automatic prerequisite validation and credit limits (min/max credits per semester).
  - Schedule conflict detection preventing overlapping class times.
* **Academic Performance & Transcript:**
  - Cumulative GPA calculation (scale 10 and scale 4.0).
  - Total credits earned, academic standing (Xuất sắc, Giỏi, Khá, Trung bình, Cảnh báo học vụ).
* **Tuition & VietQR Online Payment:**
  - Itemized tuition invoices per semester.
  - One-click checkout generating instant VietQR codes via PayOS with auto-verification and real-time status updates.
* **Personal Timetable:** Interactive visual schedule with room numbers, instructors, and class periods.

---

## 💡 4. Enterprise Engineering Deep-Dives

### ⚡ 1. High-Concurrency Course Registration (Zero Over-Enrollment)
During registration opening, hundreds of students concurrently attempt to enroll in popular classes with limited quotas.
* **Solution:** Employed **Pessimistic Locking (`LockModeType.PESSIMISTIC_WRITE`)** on `CreditClass` during the enrollment transaction.
* **Result:** Guaranteed atomicity, strict quota enforcement (`enrolled_count < max_students`), and zero race condition over-enrollment verified by `CourseRegistrationAtomicityTest`.

### 🛡️ 2. Zero-Trust Security & Fine-Grained IDOR Defense
Many student management systems suffer from Insecure Direct Object References (e.g., student A accessing student B's transcript or invoices by modifying URL IDs).
* **Solution:** Implemented programmatic record-level authorization in [`SecurityService.java`](file:///d:/DATN/StudentManager/student-management/src/main/java/com/student/management/security/SecurityService.java):
  - `@PreAuthorize("@securityService.isSelfStudent(#studentId)")`
  - `@PreAuthorize("@securityService.isClassInstructorByGradeId(#gradeId)")`
* **Result:** Even with valid JWT tokens, unauthorized users cannot tamper with or inspect records outside their assigned boundary.

### 💳 3. Idempotent Fintech Integration (PayOS VietQR)
* Built an automated reconciliation engine with webhook checksum verification (`HmacSHA256`).
* Automatic state transition: `PENDING` $\rightarrow$ `PAID` with optimistic locking (`@Version`) preventing duplicate payment processing.
* Background scheduler [`PayOSReconciliationScheduler`](file:///d:/DATN/StudentManager/student-management/src/main/java/com/student/management/service/PayOSReconciliationScheduler.java) automatically polls unconfirmed transactions to guarantee eventual consistency.

### 📐 4. Clean Architecture & Zero God Components
* Frontend components strictly adhere to the Single Responsibility Principle (SRP):
  - Large screens broken down into modular sub-components and custom hooks (`100 - 250 LOC/file`).
  - Strict linting and scope check: **125/125 files passing syntax, scope, and semantic verification with 0 errors**.
* Backend layers strictly separated:
  - Controllers $\rightarrow$ Services $\rightarrow$ Repositories $\rightarrow$ JPA Entities $\rightarrow$ Immutable DTOs with Bean Validation.

---

## 🚀 5. Quick Start & Installation

### Prerequisites
- **Java Development Kit (JDK):** Version 21 LTS
- **Node.js:** Version 20.x or higher
- **Database:** MySQL 8.0 (or Docker)
- **Maven:** 3.9+ (or use bundled `./mvnw`)

---

### Method 1: 1-Click Launch (Windows Developer Experience)
Simply double-click the included Windows launcher:
```cmd
start-all.bat
```
*Automatically boots Spring Boot backend on port 8080, Vite frontend on port 3000, and opens your browser.*

---

### Method 2: Multi-Container Docker Deployment (Recommended)
Boot the entire ecosystem (MySQL 8, phpMyAdmin, Backend, Frontend) with one command:

```bash
docker-compose up -d --build
```

Access points:
- 🌐 **Frontend Application:** `http://localhost:80` (or `http://localhost:3000` for dev)
- 🔌 **Backend REST API:** `http://localhost:8080/api/v1`
- 📑 **Swagger UI Documentation:** `http://localhost:8080/swagger-ui/index.html`
- 🗄️ **phpMyAdmin Database GUI:** `http://localhost:8081`

---

### Method 3: Manual Step-by-Step Setup

#### 1. Backend Setup (Spring Boot)
```bash
cd student-management

# Configure database in src/main/resources/application.properties or environment variables
# Run tests & verify
mvn clean test

# Launch backend
mvn spring-boot:run
```

#### 2. Frontend Setup (React SPA)
```bash
cd student-management-frontend

# Install dependencies
npm install

# Run static syntax validation & production build check
npm run check

# Launch development server
npm run dev
```

---

## 🔑 6. Demo Access Credentials

The system initializes with ready-to-test seeded accounts representing all 3 user tiers:

| Role | Username | Password | Linked Profile / Scope | Key Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| 🛡️ **Administrator** | `admin` | `admin123` | System Master Admin | Full configuration, users, policies, audit logs |
| 👨‍🏫 **Lecturer** | `teacher` | `teacher123` | Giảng viên `GV001` (Trần Văn Giảng) | View assigned classes, grading sheets, grade stats |
| 👨‍🎓 **Student** | `student` | `student123` | Sinh viên `SV001` (Nguyễn Văn An) | Course registration, grades, tuition & VietQR payment |

---

## 🧪 7. Automated Testing & Verification Proof

The codebase incorporates comprehensive testing covering unit, integration, and concurrency scenarios:

```text
[INFO] Results:
[INFO] Tests run: 42, Failures: 0, Errors: 0, Skipped: 0
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] Total time: 41.344 s
```

### Highlights of Test Suites:
- `CourseRegistrationAtomicityTest`: Validates zero over-enrollment under multithreaded concurrent requests.
- `TeacherPortalSecurityIntegrationTest`: Verifies teacher IDOR isolation and record access boundaries.
- `SubjectGradePolicyTest`: Confirms exact compliance with Vietnamese Circular 08/2021/TT-BGDĐT grading formulas.
- `TuitionServiceTest` & `PayOSServiceTest`: Validates ledger accuracy, invoice generation, and payment integrity.

---

## 📑 8. API Specification & Documentation

The application exposes interactive **OpenAPI 3.0 (Swagger UI)** documentation available at:
`http://localhost:8080/swagger-ui/index.html`

### Standard JSON Response Contract:
```json
{
  "status": 200,
  "message": "Operation executed successfully",
  "data": { ... },
  "timestamp": "2026-09-05T14:30:00"
}
```

---

## 📁 9. Repository Directory Layout

```
StudentManager/
├── .github/workflows/          # Automated GitHub Actions CI/CD pipelines (Backend & Frontend)
├── docker-compose.yml          # Local multi-container Docker composition
├── docker-compose.prod.yml     # Hardened production Docker orchestration
├── nginx/                      # Production Nginx reverse proxy configuration & maintenance page
├── scripts/                    # Automated database backup scripts
├── start-all.bat               # Windows 1-click system launcher
├── student-management/         # Spring Boot 3 (Java 21) Backend Service
│   ├── src/main/java/          # Clean Architecture layers (Controllers, Services, Repositories, Entities)
│   ├── src/main/resources/     # Application configs, Flyway migrations (V1 to V18), seed data
│   └── src/test/java/          # 42 unit, integration, and concurrency tests
└── student-management-frontend/# React 18 + Vite SPA Client
    ├── src/components/         # Reusable UI primitives, Modals, Tables, Charts, Navigation
    ├── src/features/           # Modularized domain features (Student, Teacher, Admin)
    ├── src/hooks/              # Custom React hooks encapsulating state & API logic
    ├── src/services/ / api/    # Axios HTTP clients & error handling interceptors
    └── scripts/check-syntax.cjs# Strict automated syntax & scope validator
```

---

## 👨‍💻 Author & Contributions

- **Lead Engineer / Author:** Nguyen Le ([@NguyenLee15](https://github.com/NguyenLee15))
- **Specialization:** Fullstack Engineering • Cloud-Native Java (Spring Boot) & Modern Frontend (React)
- **Project Type:** Graduation Thesis (Đồ Án Tốt Nghiệp) / University ERP Showcase

---

<div align="center">
  <sub>Built with ❤️ and dedication to clean code, robust architecture, and engineering excellence.</sub>
</div>
