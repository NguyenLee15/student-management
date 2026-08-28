import React from 'react';
import StudentPortalLayout from '../features/student/layout/StudentPortalLayout';

export default function StudentLayout({ currentUser, onLogout, onNotify, onRoleSwitch }) {
  return (
    <StudentPortalLayout
      user={currentUser}
      onLogout={onLogout}
      onSwitchToAdmin={onRoleSwitch ? () => onRoleSwitch('ROLE_ADMIN') : null}
    />
  );
}