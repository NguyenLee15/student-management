// cSpell:disable
/**
 * scheduleUtils.js
 * Tiện ích chuẩn hóa và phân tích thời khóa biểu giảng dạy / học tập
 */

export const parseDayOfWeek = (schedule) => {
  if (!schedule) return 'MONDAY';
  if (schedule.dayOfWeek) {
    const d = String(schedule.dayOfWeek).toUpperCase();
    if (['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(d)) {
      return d;
    }
  }

  const text = (schedule.studyTime || '').toLowerCase();
  if (text.includes('thứ 2') || text.includes('thứ hai') || text.includes('t2') || text.includes('mon')) return 'MONDAY';
  if (text.includes('thứ 3') || text.includes('thứ ba') || text.includes('t3') || text.includes('tue')) return 'TUESDAY';
  if (text.includes('thứ 4') || text.includes('thứ tư') || text.includes('t4') || text.includes('wed')) return 'WEDNESDAY';
  if (text.includes('thứ 5') || text.includes('thứ năm') || text.includes('t5') || text.includes('thu')) return 'THURSDAY';
  if (text.includes('thứ 6') || text.includes('thứ sáu') || text.includes('t6') || text.includes('fri')) return 'FRIDAY';
  if (text.includes('thứ 7') || text.includes('thứ bảy') || text.includes('t7') || text.includes('sat')) return 'SATURDAY';
  if (text.includes('chủ nhật') || text.includes('cn') || text.includes('sun')) return 'SUNDAY';

  return 'MONDAY';
};

export const getDayLabel = (dayKey) => {
  const map = {
    MONDAY: 'Thứ Hai',
    TUESDAY: 'Thứ Ba',
    WEDNESDAY: 'Thứ Tư',
    THURSDAY: 'Thứ Năm',
    FRIDAY: 'Thứ Sáu',
    SATURDAY: 'Thứ Bảy',
    SUNDAY: 'Chủ Nhật',
  };
  return map[dayKey] || dayKey;
};

export const formatStudyTimeDisplay = (schedule) => {
  if (!schedule) return '--';
  if (schedule.studyTime && schedule.studyTime.trim()) {
    return schedule.studyTime.trim();
  }
  const dayName = getDayLabel(parseDayOfWeek(schedule));
  const shift = schedule.classShift || 'Ca học';
  return `${dayName}, ${shift}`;
};

