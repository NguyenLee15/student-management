import { msg } from '../../../lib/messages';
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Search, Filter, ShoppingCart, CheckCircle, 
  AlertCircle, Clock, Calendar, Users, ArrowRight, RefreshCw, Trash2, CheckCircle2 
} from 'lucide-react';
import { studentRegistrationApi, registrationPeriodApi } from '../../../api';
import RegistrationCartDrawer from './RegistrationCartDrawer';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Skeleton from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export default function CourseRegistrationView({ onNotify }) {
  const [activeTab, setActiveTab] = useState('available'); // 'available' | 'enrolled'
  const [activePeriod, setActivePeriod] = useState(null);
  const [availableClasses, setAvailableClasses] = useState([]);
  const [myEnrollments, setMyEnrollments] = useState([]);
  const [cart, setCart] = useState([]);
  const [validationResult, setValidationResult] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [withdrawTarget, setWithdrawTarget] = useState(null);

  useEffect(() => {
    loadRegistrationData();
  }, []);

  // Validate cart whenever cart items change
  useEffect(() => {
    if (cart.length > 0) {
      validateCurrentCart();
    } else {
      setValidationResult(null);
    }
  }, [cart]);

  const loadRegistrationData = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      // 1. Load active registration period
      const periodRes = await registrationPeriodApi.getActive();
      const periods = periodRes.data || [];
      let currentSemesterId = null;
      if (periods.length > 0) {
        setActivePeriod(periods[0]);
        currentSemesterId = periods[0].semesterId || periods[0].semester;
      }

      // 2. Load available classes
      const classesRes = await studentRegistrationApi.getAvailableClasses(currentSemesterId);
      setAvailableClasses(classesRes.data || []);

      // 3. Load my registered classes
      const enrollmentsRes = await studentRegistrationApi.getMyEnrollments(currentSemesterId);
      setMyEnrollments(enrollmentsRes.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách môn học đăng ký', err);
      setErrorMessage(err.response?.data?.message || 'Không thể tải dữ liệu đợt đăng ký tín chỉ.');
    } finally {
      setLoading(false);
    }
  };

  const validateCurrentCart = async () => {
    try {
      const classIds = cart.map(c => c.creditClassId || c.id);
      const res = await studentRegistrationApi.validateCart(classIds);
      setValidationResult(res.data);
    } catch (err) {
      console.error('Lỗi kiểm tra điều kiện tiên quyết', err);
    }
  };

  const handleAddToCart = (creditClass) => {
    const classId = creditClass.creditClassId || creditClass.id;
    if (cart.some(item => (item.creditClassId || item.id) === classId)) {
      setCart(cart.filter(item => (item.creditClassId || item.id) !== classId));
    } else {
      setCart([...cart, creditClass]);
    }
  };

  const handleRemoveFromCart = (classId) => {
    setCart(cart.filter(item => (item.creditClassId || item.id) !== classId));
  };

  const handleSubmitBatch = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const classIds = cart.map(c => c.creditClassId || c.id);
      const idempotencyKey = 'REG-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
      const res = await studentRegistrationApi.registerBatch(classIds, idempotencyKey);
      
      const successMsg = res.data?.message || 'Đăng ký học phần thành công!';
      setSuccessMessage(successMsg);
      onNotify?.('success', successMsg);
      setCart([]);
      setIsCartOpen(false);
      await loadRegistrationData();
    } catch (err) {
      console.error('Đăng ký học phần thất bại', err);
      const errorData = err.response?.data;
      const errMsg = errorData?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại điều kiện giỏ môn học.';
      setErrorMessage(errMsg);
      onNotify?.('error', errMsg);
      if (errorData?.details) {
        setValidationResult({ valid: false, violations: Array.isArray(errorData.details) ? errorData.details : [errorData.details] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDropCourse = (enrollmentId, subjectName) => {
    setWithdrawTarget({ enrollmentId, subjectName });
  };
  
  const confirmWithdraw = async () => {
    if (!withdrawTarget) return;
    const { enrollmentId, subjectName } = withdrawTarget;
    setWithdrawTarget(null);

    try {
      await studentRegistrationApi.dropCourse(enrollmentId);
      const successMsg = `Đã rút môn '${subjectName}' thành công.`;
      setSuccessMessage(successMsg);
      onNotify?.('success', successMsg);
      await loadRegistrationData();
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Không thể rút học phần.';
      setErrorMessage(errMsg);
      onNotify?.('error', errMsg);
    }
  };

  const filteredClasses = availableClasses.filter(c => {
    const kw = searchKeyword.toLowerCase();
    return (
      (c.subjectName && c.subjectName.toLowerCase().includes(kw)) ||
      (c.subjectId && c.subjectId.toLowerCase().includes(kw)) ||
      (c.creditClassName && c.creditClassName.toLowerCase().includes(kw)) ||
      (c.teacherName && c.teacherName.toLowerCase().includes(kw))
    );
  });

  const enrolledCredits = myEnrollments.reduce((acc, e) => acc + (e.credits || 0), 0);

  return (
    <div className="space-y-6">
      {/* Active Period Banner */}
      <div className={`bg-gradient-to-r ${activePeriod ? 'from-blue-700 via-indigo-700 to-purple-800' : 'from-slate-800 via-slate-900 to-indigo-950'} rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6`}>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {activePeriod ? (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Đợt Đăng Ký Đang Mở
              </span>
            ) : (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-400/30 font-bold text-xs uppercase tracking-wider rounded-full flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                Chưa Có Đợt Đăng Ký
              </span>
            )}
            <span className="text-blue-200 text-xs">
              {activePeriod ? (activePeriod.semesterName ? `${activePeriod.semesterName} • ${activePeriod.academicYearName || ''}` : (activePeriod.semester ? (msg.enum.semester[activePeriod.semester] || activePeriod.semester) : 'Học kỳ chính khóa')) : 'Học kỳ hiện tại'}
            </span>
          </div>
          <h1 className="text-2xl font-black">
            {activePeriod?.name || 'Hiện Tại Chưa Mở Đợt Đăng Ký Học Phần Mới'}
          </h1>
          {activePeriod ? (
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-300" />
                Bắt đầu: {activePeriod?.startTime ? new Date(activePeriod.startTime).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-300" />
                Hạn chót: {activePeriod?.endTime ? new Date(activePeriod.endTime).toLocaleDateString('vi-VN') : 'Đang cập nhật'}
              </span>
              <span className="flex items-center gap-1.5 font-bold text-amber-300">
                <BookOpen className="w-4 h-4" />
                Tối đa: {activePeriod?.maxCreditsAllowed || 24} tín chỉ / kỳ
              </span>
            </div>
          ) : (
            <p className="text-xs text-slate-300">
              Phòng Đào Tạo sẽ thông báo khi mở đợt đăng ký tín chỉ mới. Sinh viên vẫn có thể tra cứu các môn học đã đăng ký thành công ở tab bên dưới.
            </p>
          )}
        </div>

        {/* Quick Cart Trigger Floating Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-5 py-3 bg-white text-blue-800 hover:bg-blue-50 font-bold rounded-xl shadow-lg transition-all flex items-center gap-2.5 active:scale-95"
          >
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            <span>Giỏ Môn Học</span>
            {cart.length > 0 && (
              <span className="px-2 py-0.5 bg-rose-600 text-white text-xs font-black rounded-full animate-bounce">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-sm font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:underline text-xs font-bold">
            Đóng
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between text-rose-800 text-sm font-medium">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 hover:underline text-xs font-bold">
            Đóng
          </button>
        </div>
      )}

      {/* Tabs & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'available'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Môn Mở Đăng Ký ({availableClasses.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`flex-1 md:flex-none px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'enrolled'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle className="w-4 h-4" />
            <span>Đã Đăng Ký ({myEnrollments.length} môn - {enrolledCredits} TC)</span>
          </button>
        </div>

        {activeTab === 'available' && (
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo mã môn, tên môn, giảng viên..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Available Classes */}
      {activeTab === 'available' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Mã & Tên Học Phần</th>
                  <th className="px-4 py-3.5">Số TC</th>
                  <th className="px-4 py-3.5">Giảng Viên</th>
                  <th className="px-4 py-3.5">Phòng / Lịch Học</th>
                  <th className="px-4 py-3.5 text-center">Sĩ Số</th>
                  <th className="px-4 py-3.5 text-right">Học Phí</th>
                  <th className="px-5 py-3.5 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="px-5 py-4">
                        <Skeleton className="h-4 w-16 mb-2 rounded" />
                        <Skeleton className="h-5 w-48 mb-1 rounded" />
                        <Skeleton className="h-3 w-32 rounded" />
                      </td>
                      <td className="px-4 py-4"><Skeleton className="h-5 w-8 rounded" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-28 rounded" /></td>
                      <td className="px-4 py-4"><Skeleton className="h-4 w-24 rounded" /></td>
                      <td className="px-4 py-4 text-center"><Skeleton className="h-4 w-16 mx-auto rounded" /></td>
                      <td className="px-4 py-4 text-right"><Skeleton className="h-4 w-24 ml-auto rounded" /></td>
                      <td className="px-5 py-4 text-center"><Skeleton className="h-8 w-24 mx-auto rounded-xl" /></td>
                    </tr>
                  ))
                ) : filteredClasses.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12">
                      <EmptyState
                        icon={BookOpen}
                        title="Không tìm thấy lớp học phần nào"
                        description="Hiện tại không có lớp học phần nào mở đăng ký khớp với từ khóa tìm kiếm."
                      />
                    </td>
                  </tr>
                ) : (
                  filteredClasses.map((item) => {
                    const classId = item.creditClassId || item.id;
                    const isSelected = cart.some(c => (c.creditClassId || c.id) === classId);
                    const isAlreadyEnrolled = myEnrollments.some(e => e.creditClassId === classId);
                    const isFull = (item.enrolledCount || 0) >= (item.maxStudents || 40);

                    return (
                      <tr key={classId} className="hover:bg-blue-50/40 transition-colors">
                        <td className="px-5 py-4">
                          <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-xs rounded mb-1">
                            {item.subjectId}
                          </span>
                          <div className="font-bold text-slate-900">{item.subjectName}</div>
                          <div className="text-xs text-slate-400">{item.creditClassName}</div>
                        </td>
                        <td className="px-4 py-4 font-bold text-slate-800">
                          {item.credits || 3}
                        </td>
                        <td className="px-4 py-4 text-slate-700 font-medium">
                          {item.teacherName || 'Chưa phân công'}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600">
                          <div className="font-semibold text-slate-800">{item.roomName || 'Chưa xếp phòng'}</div>
                          <div className="text-slate-400">{item.semester ? msg.enum.semester[item.semester] : 'Học kỳ 1'}</div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`text-xs font-bold ${isFull ? 'text-rose-600' : 'text-slate-700'}`}>
                              {item.enrolledCount || 0} / {item.maxStudents || 40}
                            </span>
                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  isFull ? 'bg-rose-500' : 'bg-blue-600'
                                }`}
                                style={{
                                  width: `${Math.min(100, ((item.enrolledCount || 0) / (item.maxStudents || 40)) * 100)}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-right font-bold text-slate-800">
                          {((item.credits || 3) * (item.tuitionPerCredit || item.pricePerCredit || 500000)).toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-5 py-4 text-center">
                          {isAlreadyEnrolled ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg">
                              <CheckCircle className="w-3.5 h-3.5" /> Đã ĐK
                            </span>
                          ) : isFull ? (
                            <span className="inline-block text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg">
                              Hết chỗ
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(item)}
                              className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 mx-auto ${
                                isSelected
                                  ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm active:scale-95'
                              }`}
                            >
                              {isSelected ? 'Bỏ chọn' : '+ Chọn lớp'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Enrolled Classes */}
      {activeTab === 'enrolled' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-sm font-bold text-slate-700">
              Danh sách {myEnrollments.length} học phần chính thức đã đăng ký
            </span>
            <span className="text-sm font-bold text-blue-700">
              Tổng số tín chỉ: {enrolledCredits} / 24
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50/80 text-xs uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Mã & Tên Môn Học</th>
                  <th className="px-4 py-3.5">Số TC</th>
                  <th className="px-4 py-3.5">Giảng Viên</th>
                  <th className="px-4 py-3.5">Phòng Học</th>
                  <th className="px-4 py-3.5">Ngày Đăng Ký</th>
                  <th className="px-4 py-3.5">Trạng Thái</th>
                  <th className="px-5 py-3.5 text-center">Rút Môn</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70">
                {myEnrollments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12">
                      <EmptyState
                        icon={BookOpen}
                        title="Chưa có học phần nào được đăng ký"
                        description="Bạn chưa đăng ký lớp học phần nào trong học kỳ này. Hãy chuyển sang tab 'Môn Mở Đăng Ký' để bắt đầu chọn môn."
                      />
                    </td>
                  </tr>
                ) : (
                  myEnrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-xs rounded mb-1">
                          {enr.subjectId}
                        </span>
                        <div className="font-bold text-slate-900">{enr.subjectName}</div>
                        <div className="text-xs text-slate-400">{enr.classCode}</div>
                      </td>
                      <td className="px-4 py-4 font-bold text-slate-800">{enr.credits}</td>
                      <td className="px-4 py-4 text-slate-700">{enr.teacherName || 'Chưa phân công'}</td>
                      <td className="px-4 py-4 text-slate-700">{enr.roomName || 'Chưa xếp phòng'}</td>
                      <td className="px-4 py-4 text-xs text-slate-500">
                        {enr.enrollmentDate ? new Date(enr.enrollmentDate).toLocaleDateString('vi-VN') : 'Chưa ghi nhận'}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-emerald-800 font-bold text-xs rounded-full">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {enr.statusName || 'Đang theo học'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => handleDropCourse(enr.id, enr.subjectName)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Rút môn học"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <RegistrationCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        validationResult={validationResult}
        isSubmitting={isSubmitting}
        onSubmitRegistration={handleSubmitBatch}
      />

      <ConfirmDialog 
        isOpen={!!withdrawTarget}
        title="Xác nhận rút môn học"
        message={withdrawTarget ? `Bạn có chắc chắn muốn rút môn học '${withdrawTarget.subjectName}' không?` : ''}
        confirmText="Rút môn"
        cancelText="Hủy"
        onConfirm={confirmWithdraw}
        onCancel={() => setWithdrawTarget(null)}
        isDestructive={true}
      />
    </div>
  );
}
