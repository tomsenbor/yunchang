'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export const toastMessages = {
  favorite: '已收藏到工具板',
  compare: '已加入对比',
  workflow: '已保存到工作流'
} as const;

type ToastMessage = (typeof toastMessages)[keyof typeof toastMessages] | string;

type ToastContextValue = {
  showToast: (message: ToastMessage) => void;
  messages: typeof toastMessages;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastMessage>('');

  const showToast = useCallback((message: ToastMessage) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(''), 2000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const value = useMemo(() => ({ showToast, messages: toastMessages }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={`toast-shell ${toast ? 'toast-shell-visible' : ''}`} role="status" aria-live="polite">
        <span className="toast-dot" />
        <span>{toast}</span>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    return {
      showToast: () => {},
      messages: toastMessages
    };
  }

  return context;
}
