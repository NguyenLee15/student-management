// cSpell:disable
import React from 'react';
import { BookOpen, Search, CheckCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useCourseRegistration } from '../hooks/useCourseRegistration';
import RegistrationBanner from './RegistrationBanner';
import AvailableClassesTable from './AvailableClassesTable';
import EnrolledClassesTable from './EnrolledClassesTable';
import RegistrationCartDrawer from './RegistrationCartDrawer';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export default function CourseRegistrationView({ onNotify }) {
  const {
    activeTab,
    setActiveTab,
    activePeriod,
    availableClasses,
    myEnrollments,
    cart,
    setCart,
    validationResult,
    isCartOpen,
    setIsCartOpen,
    loading,
    searchKeyword,
    setSearchKeyword,
    isSubmitting,
    successMessage,
    setSuccessMessage,
    errorMessage,
    setErrorMessage,
    withdrawTarget,
    setWithdrawTarget,
    filteredClasses,
    enrolledCredits,
    handleAddToCart,
    handleRemoveFromCart,
    handleSubmitBatch,
    handleDropCourse,
    confirmWithdraw,
  } = useCourseRegistration({ onNotify });

  return (
    <div className="space-y-6">
      {/* Active Period Banner & Cart Trigger */}
      <RegistrationBanner
        activePeriod={activePeriod}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
      />

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
        <AvailableClassesTable
          loading={loading}
          filteredClasses={filteredClasses}
          cart={cart}
          myEnrollments={myEnrollments}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Tab 2: Enrolled Classes */}
      {activeTab === 'enrolled' && (
        <EnrolledClassesTable
          myEnrollments={myEnrollments}
          enrolledCredits={enrolledCredits}
          onDropCourse={handleDropCourse}
        />
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

      {/* Withdraw Confirm Dialog */}
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
