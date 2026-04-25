import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg';
  showDragHandle?: boolean;
}

const UniversalModal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  maxWidth = 'md',
  showDragHandle = true 
}: UniversalModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-panel" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: maxWidth === 'sm' ? '420px' : maxWidth === 'lg' ? '560px' : '480px'
        }}
      >
        {showDragHandle && <div className="modal-drag-handle" />}
        
        {(title || onClose) && (
          <div className="modal-header">
            {title && <div className="modal-title">{title}</div>}
            {onClose && (
              <button className="modal-close-btn" onClick={onClose}>
                <X size={16} />
              </button>
            )}
          </div>
        )}

        <div className="modal-body">
          {children}
        </div>

        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default UniversalModal;
