# 🔄 Quy Trình 5 Bước Phát Triển Chuẩn Cho Dự Án Student Management

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ 1. SPEC & DTO   │ ───> │ 2. PHÂN RÃ TASK │ ───> │ 3. VIẾT TEST    │ ───> │ 4. SERVICE & API│ ───> │ 5. NGHIỆM THU   │
│ Định nghĩa DTO, │      │ Tách Controller,│      │ JUnit 5 + Mockito│     │ Cài đặt logic   │      │ Đối chiếu với   │
│ Validation rules│      │ Service, Repo   │      │ cho tầng Service│      │ & Transaction   │      │ Checklist       │
└─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘      └─────────────────┘
```

1. **Bước 1 (Đặc tả):** Xác định rõ DTO, Entity và các ràng buộc Validation (sử dụng [SPEC_TEMPLATE.md](file:///d:/Downloads_All/dowloads/StudentManager.github.io-fontend/StudentManager.github.io-fontend/student-management/SPEC_TEMPLATE.md)).
2. **Bước 2 (Phân rã):** Chia nhỏ: `DTO + Mapper` ➔ `Repository Query` ➔ `Service Logic` ➔ `Controller Endpoint` ➔ `UI/Thymeleaf View`.
3. **Bước 3 (Kiểm thử):** Viết Unit Test cho Service với Mockito trước để cố định logic nghiệp vụ.
4. **Bước 4 (Triển khai):** Cài đặt logic trong Service (`@Transactional`), thêm log (`LoggerFactory`), xử lý Exception qua `@ControllerAdvice`.
5. **Bước 5 (Nghiệm thu):** Chạy `mvn test`, rà soát theo [PRODUCTION_CHECKLIST.md](file:///d:/Downloads_All/dowloads/StudentManager.github.io-fontend/StudentManager.github.io-fontend/student-management/PRODUCTION_CHECKLIST.md).
