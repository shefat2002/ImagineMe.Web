import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          {title && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
          )}
          <div className="mb-6">{children}</div>
          {footer && <div className="flex gap-3 justify-end">{footer}</div>}
        </div>
      </div>
    </div>
  );
}