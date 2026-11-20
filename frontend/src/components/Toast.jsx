import React from 'react';
import { useEvent } from '../context/EventContext';
import '../styles/Cards.css';

const Toast = () => {
  const { toast } = useEvent();

  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type || 'success'}`}>
      <span className="toast-icon">
        {toast.type === 'error' ? '❌' : toast.type === 'info' ? 'ℹ️' : '✅'}
      </span>
      <span className="toast-text">{toast.message}</span>
    </div>
  );
};

export default Toast;
