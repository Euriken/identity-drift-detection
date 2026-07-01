import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable glassmorphism modal.
 * Props: isOpen, onClose, title (optional), maxWidth (default 520), children
 */
export default function Modal({ isOpen, onClose, title, maxWidth = 520, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(2,8,23,0.82)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px 16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-card animate-scaleIn"
        style={{
          maxWidth, width: '100%',
          padding: '32px 32px 28px',
          position: 'relative',
          maxHeight: '88vh',
          overflowY: 'auto',
          border: '1px solid rgba(59,130,246,0.25)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 32, height: 32,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            color: '#94a3b8', cursor: 'pointer',
            fontSize: '0.85rem', fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,63,94,0.15)'; e.currentTarget.style.color = '#f43f5e'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#94a3b8'; }}
        >
          ✕
        </button>

        {title && (
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f1f5f9', marginBottom: 20, paddingRight: 32 }}>
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
}
