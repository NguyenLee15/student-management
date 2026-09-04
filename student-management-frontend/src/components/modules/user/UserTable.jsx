// cSpell:disable
import React from 'react';
import { Trash2 } from 'lucide-react';
import { msg } from '../../../lib/messages';
import Pagination from '../../common/Pagination';
import Skeleton from '../../common/Skeleton';
import EmptyState from '../../common/EmptyState';

export default function UserTable({
  users = [],
  loading = false,
  page = 0,
  size = 10,
  totalPages = 1,
  totalElements = 0,
  onPageChange,
  onOpenDelete,
}) {
  return (
    <div className="panel-card overflow-hidden shadow-sm">
      <div className="overflow-x-auto" aria-live="polite">
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
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </td>
                  <td className="px-5 py-4"><Skeleton className="h-5 w-24 rounded-lg" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-4 text-right"><Skeleton className="h-8 w-8 rounded-lg ml-auto" /></td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-0">
                  <EmptyState title="Không tìm thấy tài khoản" message="Không có tài khoản nào khớp với điều kiện tìm kiếm hoặc bộ lọc hiện tại." />
                </td>
              </tr>
            ) : (
              users.map((u) => (
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
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Hoạt động</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    {u.userName !== 'admin' && (
                      <button
                        onClick={() => onOpenDelete(u)}
                        title="Xóa người dùng"
                        className="inline-flex items-center justify-center min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-rose-500 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        size={size}
        totalPages={totalPages}
        totalElements={totalElements}
        onPageChange={onPageChange}
      />
    </div>
  );
}
