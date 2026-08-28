import React, { useState, useEffect } from 'react';
import { userApi } from '../../api';

import { User, Mail, Shield, Key } from 'lucide-react';
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
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[90] p-4">
        <div className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-700/50 overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Hồ Sơ & Cài Đặt</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-12 bg-slate-700/50 rounded-lg"></div>
                <div className="h-12 bg-slate-700/50 rounded-lg"></div>
              </div>
            ) : errorMsg ? (
              <p className="text-center text-rose-400 text-sm">{errorMsg}</p>
            ) : userInfo ? (
              <>
                <div className="flex items-center space-x-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  <div className="h-14 w-14 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                    <User className="h-7 w-7 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{userInfo.userName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Shield className="h-3 w-3 text-emerald-400" />
                      <span className="text-xs font-mono text-emerald-400">{userInfo.role.replace('ROLE_', '')}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {userInfo.studentId && (
                    <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg border border-slate-700/30">
                      <span className="text-sm text-slate-400">Mã Sinh Viên</span>
                      <span className="text-sm font-bold text-white font-mono">{userInfo.studentId}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-700/50">
                  <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full flex items-center justify-between p-4 bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/50 rounded-xl transition-colors group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center group-hover:bg-indigo-500/30 transition-colors">
                        <Key className="h-4 w-4 text-indigo-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-white">Đổi Mật Khẩu</p>
                        <p className="text-xs text-slate-400">Cập nhật mật khẩu bảo mật tài khoản</p>
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-white transition-colors">→</span>
                  </button>
                </div>
              </>
            ) : (
              <p className="text-center text-slate-400 text-sm">Không tải được thông tin</p>
            )}
          </div>
        </div>
      </div>

      <ChangePasswordModal 
        isOpen={isPasswordModalOpen} 
        onClose={() => setIsPasswordModalOpen(false)} 
      />
    </>
  );
};

export default ProfileSettingsModal;


