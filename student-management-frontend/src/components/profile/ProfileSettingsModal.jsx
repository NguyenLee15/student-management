import React, { useState, useEffect } from 'react';
import { userApi } from '../../api';
import { User, Mail, Shield, Key } from 'lucide-react';
import Modal from '../common/Modal';
import ChangePasswordModal from '../auth/ChangePasswordModal';

const ProfileSettingsModal = ({ isOpen, onClose }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUserInfo();
    }
  }, [isOpen]);

  const loadUserInfo = async () => {
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await userApi.getMe();
      setUserInfo(res.data);
    } catch (error) {
      setErrorMsg('Không thể tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Hồ Sơ & Cài Đặt Tài Khoản"
        subtitle="Quản lý thông tin định danh và bảo mật tài khoản"
        maxWidth="max-w-md"
      >
        <div className="space-y-5">
          {loading ? (
            <div className="space-y-3 animate-pulse py-2">
              <div className="h-16 bg-slate-900 border border-slate-800 rounded-xl"></div>
              <div className="h-12 bg-slate-900 border border-slate-800 rounded-xl"></div>
            </div>
          ) : errorMsg ? (
            <p className="text-center text-rose-400 text-xs py-4 bg-rose-950/20 border border-rose-800/40 rounded-xl">{errorMsg}</p>
          ) : userInfo ? (
            <>
              <div className="flex items-center space-x-3.5 p-3.5 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="h-12 w-12 rounded-xl bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-bold text-lg">
                  {userInfo.userName?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div>
                  <h3 className="text-white font-bold text-base leading-tight">{userInfo.userName}</h3>
                  <div className="flex items-center space-x-1.5 mt-1">
                    <Shield className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] font-mono font-semibold text-emerald-400">
                      {userInfo.role ? userInfo.role.replace('ROLE_', '') : 'ADMIN'}
                    </span>
                  </div>
                </div>
              </div>

              {userInfo.studentId && (
                <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400">Mã Định Danh</span>
                  <span className="font-bold text-white font-mono">{userInfo.studentId}</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-lg bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600/30 transition">
                      <Key className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-white">Đổi Mật Khẩu</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Cập nhật mật khẩu bảo vệ tài khoản</p>
                    </div>
                  </div>
                  <span className="text-slate-500 group-hover:text-white transition">→</span>
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-slate-400 text-xs py-4">Không tải được thông tin hồ sơ.</p>
          )}

          <div className="flex justify-end pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </Modal>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </>
  );
};

export default ProfileSettingsModal;


