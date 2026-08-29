import { msg } from '../../lib/messages';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ShieldAlert, Key, UserCheck, RefreshCw } from 'lucide-react';
import { userApi } from '../../api';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';

export default function UserModule({ onNotify }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = { userName: '', password: '', role: 'ROLE_TEACHER', studentId: '' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadUsers();
  }, [page, size]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await userApi.getAll({ page, size });
      const d = res.data || res;
      if (d && d.content) {
        setUsers(d.content);
        setTotalPages(d.totalPages || 1);
        setTotalElements(d.totalElements || d.content.length);
      } else if (Array.isArray(d)) {
        setUsers(d);
        setTotalPages(1);
        setTotalElements(d.length);
      }
    } catch (err) {
      console.warn('Err load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setFormData(initialForm);
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.userName?.trim() || formData.userName.trim().length < 3) {
      onNotify('error', 'Tên đăng nhập phải có ít nhất 3 ký tự.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      onNotify('error', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      onNotify('error', 'Địa chỉ email không đúng định dạng.');
      return;
    }
    try {
      await userApi.create(formData);
      onNotify('success', msg.success.created('tài khoản', formData.userName));
      setShowModal(false);
      loadUsers();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi tạo tài khoản');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userApi.delete(deleteTarget.userName);
      onNotify('success', msg.success.deleted('tài khoản', deleteTarget.userName));
      loadUsers();
    } catch (err) {
      onNotify('error', err?.message || 'Lỗi khi xóa tài khoản');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Quản Lý Tài Khoản & Phân Quyền Người Dùng</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý tài khoản người dùng, phân quyền truy cập và bảo mật hệ thống</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Tài Khoản Mới</span>
        </button>
      </div>

      <div className="panel-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Tên đăng nhập</th>
                <th className="px-5 py-3.5">Quyền Hạn</th>
                <th className="px-5 py-3.5">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.userName} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-3.5 font-bold text-white font-mono flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs">
                      {u.userName?.charAt(0)?.toUpperCase()}
                    </div>
                    <span>{u.userName}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold ${
                      u.role === 'ROLE_ADMIN' || u.role === 'ADMIN'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        : u.role === 'ROLE_STUDENT' || u.role === 'STUDENT'
                        ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {msg.enum.role[u.role] || u.role}
                    </span>
                    {u.studentId && (
                      <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                        {u.studentId}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-emerald-400 font-semibold flex items-center gap-1.5 pt-4">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Hoạt động</span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {u.userName !== 'admin' && (
                      <button
                        onClick={() => setDeleteTarget(u)}
                        title="Xóa người dùng"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          size={size}
          totalPages={totalPages}
          totalElements={totalElements}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Tạo Tài Khoản Người Dùng Mới"
        subtitle="Nhập tên đăng nhập, mật khẩu và phân quyền truy cập"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Tên Đăng Nhập*</label>
            <input
              type="text"
              required
              placeholder="VD: giangvien_an"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Mật Khẩu Khởi Tạo*</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Vai Trò Phân Quyền*</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="ROLE_TEACHER">Giảng viên</option>
              <option value="ROLE_STUDENT">Sinh viên</option>
              <option value="ROLE_ADMIN">Quản trị viên</option>
            </select>
          </div>

          {formData.role === 'ROLE_STUDENT' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Mã Sinh Viên Liên Kết *</label>
              <input
                type="text"
                required
                placeholder="VD: SV20210001"
                value={formData.studentId || ''}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >Hủy</button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg shadow-red-600/30 transition"
            >
              Tạo Tài Khoản
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Xóa Tài Khoản Người Dùng"
        message={`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản "${deleteTarget?.userName}"?`}
      />
    </div>
  );
}
