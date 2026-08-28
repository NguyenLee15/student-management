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
    try {
      await userApi.create(formData);
      onNotify('success', `User account ${formData.userName} created successfully!`);
      setShowModal(false);
      loadUsers();
    } catch (err) {
      onNotify('error', err?.message || 'Error creating user account');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await userApi.delete(deleteTarget.userName);
      onNotify('success', `User ${deleteTarget.userName} deleted!`);
      loadUsers();
    } catch (err) {
      onNotify('error', err?.message || 'Error deleting user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">System Users & Access Roles</h1>
          <p className="text-xs text-slate-400 mt-1">Quản lý tài khoản người dùng, phân quyền truy cập và bảo mật hệ thống</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New User Account</span>
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Tên đăng nhập</th>
                <th className="px-5 py-3.5">Assigned Authority (Role)</th>
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
                      {u.role}
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
                        title="Delete user"
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
        title="Create System User Account"
        subtitle="Specify credentials and Spring Security role assignment"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Username*</label>
            <input
              type="text"
              required
              placeholder="e.g. lecturer_john"
              value={formData.userName}
              onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Password (BCrypt encoded)*</label>
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
            <label className="block text-slate-300 font-semibold mb-1">Security Role*</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-red-500"
            >
              <option value="ROLE_TEACHER">TEACHER (Giảng viên phụ trách môn)</option>
              <option value="ROLE_STUDENT">STUDENT (Sinh viên học tập)</option>
              <option value="ROLE_ADMIN">ADMIN (Quản trị viên toàn hệ thống)</option>
            </select>
          </div>

          {formData.role === 'ROLE_STUDENT' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Associated Student ID (Mã SV)*</label>
              <input
                type="text"
                required
                placeholder="e.g. SV20210001"
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
              Create Account
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete User Account"
        message={`Are you sure you want to permanently delete user account "${deleteTarget?.userName}"?`}
      />
    </div>
  );
}
