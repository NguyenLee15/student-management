// cSpell:disable
import { useCallback } from 'react';

/**
 * useGradeKeyboardNav.js
 * Quản lý điều hướng bàn phím (ArrowUp, ArrowDown, Enter) giữa các ô nhập điểm
 */
export function useGradeKeyboardNav() {
  const handleGradeKeyDown = useCallback((e, index, field) => {
    const table = e?.currentTarget?.closest('table');
    if (!table) return;

    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      e.preventDefault();
      const nextInput = table.querySelector(`input[data-field="${field}"][data-idx="${index + 1}"]`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = table.querySelector(`input[data-field="${field}"][data-idx="${index - 1}"]`);
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  }, []);

  return { handleGradeKeyDown };
}

