// cSpell:disable
import React from 'react';
import Modal from '../../common/Modal';

export default function ClassroomFormModal({
  isOpen = false,
  onClose,
  isEdit = false,
  formData,
  setFormData,
  onSubmit,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Cập Nhật Phòng Học' : 'Thêm Phòng Học Mới'}
      subtitle="Thiết lập mã phòng, tên phòng học, tòa nhà và sức chứa tối đa"
      maxWidth="max-w-md"
    >
      <form onSubmit={onSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-semibold mb-1">Mã Phòng Học*</label>
          <input
            type="text"
            required
            disabled={isEdit}
            placeholder="VD: A101"
            value={formData.roomId}
            onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
            className={`w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500 ${
              isEdit ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1">Tên Giảng Đường / Phòng Học*</label>
          <input
            type="text"
            required
            placeholder="VD: Giảng đường A1-01"
            value={formData.roomName}
            onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tòa Nhà*</label>
            <select
              value={formData.building}
              onChange={(e) => setFormData({ ...formData, building: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="BUILDING_A">Tòa A</option>
              <option value="BUILDING_B">Tòa B</option>
              <option value="BUILDING_C">Tòa C</option>
              <option value="BUILDING_D">Tòa D</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Sức Chứa (Chỗ ngồi)*</label>
            <input
              type="number"
              min="10"
              max="300"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30 transition"
          >
            {isEdit ? 'Lưu Thay Đổi' : 'Thêm Phòng Học'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
