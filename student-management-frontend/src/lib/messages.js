/**
 * Dictionary & Helper tiếng Việt cho toàn bộ hệ thống
 */

export const msg = {
  success: {
    created: (entity, id = '') => `Thêm mới ${entity} ${id} thành công!`.trim().replace(/\s+/g, ' '),
    updated: (entity, id = '') => `Cập nhật ${entity} ${id} thành công!`.trim().replace(/\s+/g, ' '),
    deleted: (entity, id = '') => `Xóa ${entity} ${id} thành công!`.trim().replace(/\s+/g, ' '),
  },
  error: {
    save: (entity) => `Lỗi khi lưu ${entity}`,
    delete: (entity) => `Lỗi khi xóa ${entity}`,
    load: (entity) => `Lỗi khi tải dữ liệu ${entity}`,
    network: 'Không thể kết nối máy chủ. Vui lòng kiểm tra kết nối mạng.',
  },
  confirm: {
    delete: (entity, name, id) => {
      const nameStr = name ? ` "${name}"` : '';
      const idStr = id ? ` (Mã: ${id})` : '';
      return `Bạn có chắc chắn muốn xóa ${entity}${nameStr}${idStr}? Thao tác này không thể hoàn tác.`.trim().replace(/\s+/g, ' ');
    }
  },
  enum: {
    gender: { MALE: 'Nam', FEMALE: 'Nữ', OTHER: 'Khác' },
    semester: { SEMESTER_1: 'Học kỳ 1', SEMESTER_2: 'Học kỳ 2', SUMMER_SEMESTER: 'Học kỳ hè', SEMESTER_SUMMER: 'Học kỳ hè', SUMMER: 'Học kỳ hè' },
    building: { BUILDING_A: 'Tòa A', BUILDING_B: 'Tòa B', BUILDING_C: 'Tòa C', BUILDING_D: 'Tòa D' },
    shift: { SHIFT_1: 'Ca 1 (07:00 - 09:15)', SHIFT_2: 'Ca 2 (09:30 - 11:45)', SHIFT_3: 'Ca 3 (13:00 - 15:15)', SHIFT_4: 'Ca 4 (15:30 - 17:45)', SHIFT_5: 'Ca 5 (18:00 - 20:15)', MORNING: 'Ca Sáng', AFTERNOON: 'Ca Chiều', EVENING: 'Ca Tối' },
    subjectType: { MAJOR: 'Chuyên ngành', GENERAL_EDUCATION: 'Đại cương', BASIC: 'Cơ sở ngành', SPECIALIZED: 'Chuyên sâu', ELECTIVE: 'Tự chọn' },
    role: { ROLE_ADMIN: 'Quản trị viên', ROLE_TEACHER: 'Giảng viên', ROLE_STUDENT: 'Sinh viên', ADMIN: 'Quản trị viên', TEACHER: 'Giảng viên', STUDENT: 'Sinh viên' },
    healthStatus: { UP: 'Hoạt động', OFFLINE: 'Ngắt kết nối', DISCONNECTED: 'Mất kết nối', UNKNOWN: 'Không xác định' },
    weekday: { MONDAY: 'Thứ Hai', TUESDAY: 'Thứ Ba', WEDNESDAY: 'Thứ Tư', THURSDAY: 'Thứ Năm', FRIDAY: 'Thứ Sáu', SATURDAY: 'Thứ Bảy', SUNDAY: 'Chủ Nhật', 1: 'Thứ Hai', 2: 'Thứ Ba', 3: 'Thứ Tư', 4: 'Thứ Năm', 5: 'Thứ Sáu', 6: 'Thứ Bảy', 7: 'Chủ Nhật' },
    importStatus: { UPLOADING: 'Đang tải lên', PENDING: 'Chờ xử lý', PROCESSING: 'Đang xử lý', COMPLETED: 'Hoàn thành', COMPLETED_WITH_ERRORS: 'Hoàn thành (có lỗi)', FAILED: 'Thất bại' },
    paymentMethod: { PAYOS: 'Cổng PayOS', BANK_TRANSFER: 'Chuyển khoản', CASH: 'Tiền mặt' },
    paymentStatus: { PAID: 'Đã thanh toán', PENDING: 'Đang chờ xử lý', CANCELLED: 'Đã hủy', FAILED: 'Thất bại' },
    academicRank: { EXCELLENT: 'Xuất sắc', GOOD: 'Giỏi', FAIR: 'Khá', AVERAGE: 'Trung bình', WARNING: 'Cảnh báo học vụ', POOR: 'Yếu' }
  },
  
  /**
   * Helper an toàn để bọc message backend.
   * Ngăn chặn các thông báo tiếng Anh thô lọt ra UI.
   */
  safeMessage: (backendMsg, fallbackStr) => {
    if (!backendMsg) return fallbackStr;
    const msg = String(backendMsg);
    // Nếu có dấu tiếng Việt, cho phép hiển thị
    const hasVietnamese = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(msg);
    if (hasVietnamese) return msg;
    
    // Nếu toàn tiếng Anh, trả về fallback
    return fallbackStr;
  }
};
