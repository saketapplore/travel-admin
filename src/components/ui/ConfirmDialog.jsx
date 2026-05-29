import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmDialog = ({ 
  isOpen, 
  title = 'Are you sure?', 
  message = 'This action cannot be undone.', 
  confirmText = 'Delete', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  type = 'danger' // 'danger' | 'warning' | 'info'
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: <AlertCircle className="w-10 h-10 text-red-500" />,
      confirmBtn: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200',
      iconBg: 'bg-red-50'
    },
    warning: {
      icon: <AlertCircle className="w-10 h-10 text-orange-500" />,
      confirmBtn: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200',
      iconBg: 'bg-orange-50'
    },
    info: {
      icon: <AlertCircle className="w-10 h-10 text-blue-500" />,
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200',
      iconBg: 'bg-blue-50'
    }
  };

  const style = typeStyles[type] || typeStyles.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="premium-glass rounded-[2.5rem] shadow-2xl w-full max-w-md relative overflow-hidden animate-in zoom-in-95 duration-200 border border-white/40">
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className="absolute right-6 top-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100/50 rounded-2xl transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pt-10">
          <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className={`p-5 ${style.iconBg} rounded-[2rem] mb-6 shadow-inner`}>
              {style.icon}
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
              {title}
            </h3>
            <p className="text-gray-500 text-lg leading-relaxed mb-8 px-2">
              {message}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-4 rounded-2xl text-gray-600 font-semibold hover:bg-gray-100 transition-all duration-300 text-[1.05rem]"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-6 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-95 text-[1.05rem] ${style.confirmBtn}`}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
