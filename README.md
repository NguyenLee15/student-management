# 🎓 Student Management RESTful API Service (Java 21 & Spring Boot 3)

Professional Full-English Enterprise Backend RESTful API Service for Student & Academic Management, built with **Java 21** and **Spring Boot 3**. Integrates **Swagger UI (OpenAPI 3.0)**, **Spring Security + JWT Bearer Token Authentication**, **Spring Data JPA/Hibernate**, and **Apache POI Excel Data Processing**.

---

## 🚀 Tech Stack

- **Core & Framework**: Java 21, Spring Boot 3.4.5, Spring MVC, Spring Data JPA
- **Security**: Spring Security 6, JWT (JSON Web Token - JJWT 0.11.5), BCrypt Hashing
- **Database**: MySQL 8.0 / Hibernate ORM
- **API Documentation**: Springdoc OpenAPI 3.0 (Swagger UI)
- **Data Import/Export**: Apache POI 5.3.0 (Excel `.xlsx`)
- **DevOps & Packaging**: Maven, Docker, Docker Compose, Lombok

---

## 🛠️ Architecture & Domain Design

```
com.example.student.management
├── config/              # SecurityConfig, JwtTokenProvider, OpenApiConfig, WebMvcConfig, DataInitializer
├── controller/api/      # RESTful Controllers (/api/v1/*) returning standardized ApiResponse<T>
├── dto/
│   ├── req/             # Request DTOs with Validation constraints (StudentRequestDto, FacultyRequestDto,...)
│   └── resp/            # Response DTOs & ApiResponse<T> JSON Wrapper
├── entity/              # JPA Entities (Student, Faculty, StudentClass, AcademicYear, Teacher, User)
├── repository/          # Spring Data JPA Repositories (StudentRepository, FacultyRepository,...)
├── service/             # Business Logic Interfaces & Implementations (StudentService, FacultyService,...)
└── exception/           # Global Exception Handling & Clean Error Responses
```

---

## 📌 Standardized REST API Endpoints

All API responses are wrapped in a clean, predictable JSON format:

```json
{
  "status": 200,
  "message": "Students fetched successfully",
  "data": { ... },
  "timestamp": "2026-08-01T18:00:00"
}
```

### Key API Routes:

| Module | Method | Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/login` | Authenticate & obtain JWT Bearer Token |
| **Auth** | `POST` | `/api/v1/auth/register` | Register new user account |
| **Students** | `GET` | `/api/v1/students` | Search, filter, and paginate students |
| **Students** | `POST` | `/api/v1/students` | Create new student |
| **Students** | `PUT` | `/api/v1/students/{id}` | Update student details |
| **Students** | `DELETE` | `/api/v1/students/{id}` | Delete student |
| **Students** | `POST` | `/api/v1/students/import` | Bulk import students from Excel (.xlsx) |
| **Students** | `GET` | `/api/v1/students/export` | Download students as Excel file |
| **Faculties** | `GET` | `/api/v1/faculties` | Get list of university faculties |
| **Classes** | `GET` | `/api/v1/classes` | Get list of student classes |

---

## ⚡ Quick Start Guide

### Option 1: Run with Docker Compose (Recommended)

```bash
# Navigate to the project directory
cd student-management

# Start MySQL 8.0 & Spring Boot App synchronously
docker-compose up -d --build
```
📌 The service will be up and running at `http://localhost:8080`.

### Option 2: Run with Maven (Local Environment)

```bash
# Compile and run
./mvnw spring-boot:run
```

---

## 📄 API Documentation & Swagger UI

Once the application is running:
- **Interactive Swagger UI**: [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)
- **OpenAPI 3.0 JSON Spec**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

---

## 👤 Author
- **Name**: Le Van Nguyen
- **Email**: nguyen2004hd@gmail.com
