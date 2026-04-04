import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-md',
    md: 'max-w-[560px]',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      />
      <div 
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-[var(--bg-surface)] rounded-lg border border-[var(--border-active)] shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)' }}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
            <h2 className="text-xl font-['Orbitron'] font-bold text-[var(--text-primary)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors"
            >
              <X size={20} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded hover:bg-[var(--bg-elevated)] transition-colors z-10"
          >
            <X size={20} strokeWidth={1.5} className="text-[var(--text-secondary)]" />
          </button>
        )}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
