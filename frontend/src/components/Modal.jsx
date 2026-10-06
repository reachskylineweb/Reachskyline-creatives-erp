import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer = null,
  maxWidth,
  width,
  size,
  className = '',
  containerStyle = {},
  bodyStyle = {}
}) => {
  // Lock body scroll when modal is open
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

  const sizeClass = size ? `modal-${size}` : '';

  const dynamicContainerStyle = {
    ...(maxWidth ? { maxWidth } : {}),
    ...(width ? { width } : {}),
    ...containerStyle
  };

  return (
    <div className="modal-overlay">
      <div 
        className={`modal-container ${sizeClass} ${className}`.trim()} 
        style={dynamicContainerStyle}
        onClick={(e) => e.stopPropagation()} // Prevent close on modal body click
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body" style={bodyStyle}>
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

export default Modal;
