// cSpell:disable
import { useState, useEffect, useMemo, useCallback } from 'react';
import { studentRegistrationApi, registrationPeriodApi } from '../../../api';

export function useCourseRegistration({ onNotify }) {
  const [activeTab, setActiveTab] = useState('available');
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

  const loadRegistrationData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadRegistrationData();
  }, [loadRegistrationData]);

  const validateCurrentCart = useCallback(async () => {
    try {
      const classIds = cart.map(c => c.creditClassId || c.id);
      const res = await studentRegistrationApi.validateCart(classIds);
      setValidationResult(res.data);
    } catch (err) {
      console.error('Lỗi kiểm tra điều kiện tiên quyết', err);
    }
  }, [cart]);

  useEffect(() => {
    if (cart.length > 0) {
      validateCurrentCart();
    } else {
      setValidationResult(null);
    }
  }, [cart, validateCurrentCart]);

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

  const filteredClasses = useMemo(() => {
    const kw = searchKeyword.toLowerCase();
    return availableClasses.filter(c => 
      (c.subjectName && c.subjectName.toLowerCase().includes(kw)) ||
      (c.subjectId && c.subjectId.toLowerCase().includes(kw)) ||
      (c.creditClassName && c.creditClassName.toLowerCase().includes(kw)) ||
      (c.teacherName && c.teacherName.toLowerCase().includes(kw))
    );
  }, [availableClasses, searchKeyword]);

  const enrolledCredits = useMemo(() => {
    return myEnrollments.reduce((acc, e) => acc + (e.credits || 0), 0);
  }, [myEnrollments]);

  return {
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
    loadRegistrationData,
    handleAddToCart,
    handleRemoveFromCart,
    handleSubmitBatch,
    handleDropCourse,
    confirmWithdraw,
  };
}
