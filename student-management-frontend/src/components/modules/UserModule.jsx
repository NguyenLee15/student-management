// cSpell:disable
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, RefreshCw, Search } from 'lucide-react';
import { userApi } from '../../api';
import { msg } from '../../lib/messages';
import ConfirmDialog from '../common/ConfirmDialog';
import UserTable from './user/UserTable';
import UserFormModal from './user/UserFormModal';

export default function UserModule({ onNotify }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [keyword, setKeyword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const initialForm = { userName: '', password: '', role: 'ROLE_TEACHER', studentId: '' };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    loadUsers();
  }, [page, size]);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchKeyword = !keyword || u.userName?.toLowerCase().includes(keyword.toLowerCase());
      const matchRole = !selectedRole || u.role === selectedRole || u.role === `ROLE_${selectedRole}`;
      return matchKeyword && matchRole;
    });
  }, [users, keyword, selectedRole]);

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
      console.warn('Lỗi khi tải danh sách người dùng', err);
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
    if (!formData.password || formData.password.length < 8) {
      onNotify('error', 'Mật khẩu phải có ít nhất 8 ký tự.');
      return;
    }
    const payload = {
      userName: formData.userName.trim(),
      password: formData.password,
      role: formData.role.replace('ROLE_', ''),
      studentId: formData.role.includes('STUDENT') ? (formData.studentId?.trim() || null) : null,
    };
    try {
      await userApi.create(payload);
      onNotify('success', msg.success.created('tài khoản', payload.userName));
      setShowModal(false);
      loadUsers();
    } catch (err) {
      onNotify('error', err?.response?.data?.message || err?.message || 'Lỗi khi tạo tài khoản');
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
    <div className="space-y-6 animate-fade-in">
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

      {/* Filter and Search Bar */}
      <div className="panel-card p-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Tìm kiếm tài khoản theo tên đăng nhập..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-red-500 transition"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-red-500 transition"
          >
            <option value="">Tất Cả Vai Trò</option>
            <option value="ADMIN">Quản trị viên</option>
            <option value="TEACHER">Giảng viên</option>
            <option value="STUDENT">Sinh viên</option>
          </select>

          <button
            onClick={loadUsers}
            title="Làm mới"
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin text-red-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main User Table Component */}
      <UserTable
        users={filteredUsers}
        loading={loading}
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={(p) => setPage(p)}
        onOpenDelete={(u) => setDeleteTarget(u)}
      />

      {/* Create User Modal */}
      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSave}
      />

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
