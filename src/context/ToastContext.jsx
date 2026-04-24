import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

const icons = {
  success: <CheckCircle size={18} />,
  error:   <AlertCircle size={18} />,
  info:    <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};

const colors = {
  success: { border: 'var(--success)', color: 'var(--success)' },
  error:   { border: 'var(--danger)',  color: 'var(--danger)'  },
  info:    { border: 'var(--info)',    color: 'var(--info)'    },
  warning: { border: 'var(--warning)', color: 'var(--warning)' },
};

const ToastItem = ({ t, onDismiss }) => {
  const [exiting, setExiting] = useState(false);
  const c = colors[t.type] || colors.info;

  const dismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(t.id), 240);
  };

  return (
    <div
      className={`toast${exiting ? ' exiting' : ''}`}
      style={{ borderLeft: `3px solid ${c.border}` }}
    >
      <span style={{ color: c.color, flexShrink: 0, marginTop: '1px' }}>{icons[t.type]}</span>
      <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>
        {t.message}
      </span>
      <button
        onClick={dismiss}
        aria-label="Dismiss notification"
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'var(--text-muted)', display: 'flex', padding: '2px',
          flexShrink: 0, marginTop: '1px', borderRadius: '4px',
          transition: 'var(--transition)',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      // Trigger exit animation via state — the ToastItem handles it
      setToasts(prev => prev.map(t => t.id === id ? { ...t, _exit: true } : t));
      // Remove from DOM after animation
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 260);
    }, duration);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: '24px', right: '24px',
        display: 'flex', flexDirection: 'column', gap: '10px',
        zIndex: 9999, maxWidth: '400px',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'all' }}>
            <ToastItem t={t} onDismiss={dismiss} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
