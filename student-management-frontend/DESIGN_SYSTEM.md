# FRONTEND DESIGN SYSTEM & COMPONENT BLUEPRINTS (UNIVERSITY SIS)

Hệ thống Design Tokens và mẫu component chuẩn mực cho dự án Quản lý Sinh viên Đại học (StudentManager), lấy cảm hứng từ `shadcn-ui/taxonomy` và chuẩn Enterprise SIS.

---

## 1. DESIGN TOKENS MATRIX

| Element | Tailwind Classes | Mục đích & Ý nghĩa |
| :--- | :--- | :--- |
| **Page Surface** | `bg-slate-50 min-h-screen text-slate-900` | Nền trung tính dịu mắt khi làm việc nhiều giờ |
| **Panel / Card** | `bg-white border border-slate-200 rounded-lg shadow-sm` | Khối nội dung nổi bật, sắc nét, viền rõ |
| **Primary Action** | `bg-blue-700 hover:bg-blue-800 text-white font-medium px-4 py-2 rounded-md shadow-sm transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2` | Nút hành động chính (Lưu, Xác nhận, Thêm mới) |
| **Secondary Action**| `bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium px-4 py-2 rounded-md transition-colors` | Nút phụ (Hủy, Đóng, Làm mới) |
| **Table Head** | `bg-slate-100/75 text-slate-700 font-semibold text-xs uppercase tracking-wider px-4 py-3 border-b border-slate-200` | Tiêu đề cột bảng dữ liệu |
| **Table Row** | `border-b border-slate-100 hover:bg-blue-50/40 transition-colors text-sm text-slate-800` | Hàng dữ liệu kèm hover dịu nhẹ |
| **Numeric Code** | `font-mono tabular-nums font-medium text-slate-900` | MSSV, mã lớp, mã học phần, điểm số |

---

## 2. ACADEMIC STATUS BADGES (BẢNG MÀU NGỮ NGHĨA TRẠNG THÁI HỌC VỤ)

| Trạng thái học tập | Tailwind Style | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- |
| **Đang học (Active)** | `bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5` | Sinh viên đang theo học bình thường |
| **Bảo lưu (Deferred)** | `bg-amber-50 text-amber-700 border border-amber-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5` | Tạm ngưng học kỳ có thời hạn |
| **Cảnh báo học vụ (Warning)** | `bg-rose-50 text-rose-700 border border-rose-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5` | Điểm tích lũy dưới chuẩn (GPA < 2.0) |
| **Đã tốt nghiệp (Graduated)** | `bg-blue-50 text-blue-700 border border-blue-200 text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1.5` | Hoàn thành toàn bộ chương trình đào tạo |

---

## 3. COMPONENT BLUEPRINTS (MẪU COMPONENT CHUẨN)

### A. Data Grid Table (Bảng Dữ liệu Quản lý)
```jsx
<div className="overflow-hidden bg-white border border-slate-200 rounded-lg shadow-sm">
  <div className="overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-600">
          <th className="px-4 py-3">Mã SV</th>
          <th className="px-4 py-3">Họ và tên</th>
          <th className="px-4 py-3">Khoa / Lớp</th>
          <th className="px-4 py-3 text-right">GPA tích lũy</th>
          <th className="px-4 py-3 text-center">Trạng thái</th>
          <th className="px-4 py-3 text-right">Thao tác</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm">
        <tr className="hover:bg-slate-50/80 transition-colors">
          <td className="px-4 py-3 font-mono font-medium text-slate-900">SV2026-001</td>
          <td className="px-4 py-3 font-medium text-slate-900">Nguyễn Văn An</td>
          <td className="px-4 py-3 text-slate-600">CNTT • K21-CNTT1</td>
          <td className="px-4 py-3 text-right font-mono tabular-nums font-semibold text-slate-800">3.65 / 4.0</td>
          <td className="px-4 py-3 text-center">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              Đang học
            </span>
          </td>
          <td className="px-4 py-3 text-right">
            <button className="text-blue-700 hover:text-blue-900 font-medium text-xs hover:underline">
              Chi tiết
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### B. Filter Toolbar (Thanh lọc Khoa / Khóa / Lớp)
```jsx
<div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 mb-4">
  <div className="flex items-center gap-2 flex-1 min-w-[260px]">
    <input
      type="text"
      placeholder="Tìm theo Mã SV, Họ tên, Email..."
      className="w-full px-3 py-1.5 text-sm bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-slate-800"
    />
  </div>
  <div className="flex items-center gap-2">
    <select className="px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-blue-600">
      <option value="">Tất cả các Khoa</option>
      <option value="cntt">Khoa Công nghệ Thông tin</option>
      <option value="kt">Khoa Kinh tế</option>
    </select>
    <select className="px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-md text-slate-700 focus:ring-2 focus:ring-blue-600">
      <option value="">Khóa học (2022 - 2026)</option>
    </select>
    <button className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-3.5 py-1.5 rounded-md shadow-sm transition-colors">
      + Thêm sinh viên
    </button>
  </div>
</div>
```
