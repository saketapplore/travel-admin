import React, { useEffect, useRef, useState } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';

const EVENT_CONFIG = {
  voucher_failed: {
    icon: AlertTriangle,
    bg: 'bg-amber-50 border-amber-400',
    iconColor: 'text-amber-500',
    titleColor: 'text-amber-900',
    bar: 'bg-amber-400',
    label: 'Voucher Failed',
  },
  voucher_quarantined: {
    icon: XCircle,
    bg: 'bg-red-50 border-red-500',
    iconColor: 'text-red-500',
    titleColor: 'text-red-900',
    bar: 'bg-red-500',
    label: 'Quarantined',
  },
  voucher_generated: {
    icon: CheckCircle,
    bg: 'bg-green-50 border-green-400',
    iconColor: 'text-green-500',
    titleColor: 'text-green-900',
    bar: 'bg-green-400',
    label: 'Voucher Generated',
  },
  new_booking: {
    icon: Info,
    bg: 'bg-blue-50 border-blue-400',
    iconColor: 'text-blue-500',
    titleColor: 'text-blue-900',
    bar: 'bg-blue-400',
    label: 'New Booking',
  },
  cancellation: {
    icon: XCircle,
    bg: 'bg-red-50 border-red-400',
    iconColor: 'text-red-500',
    titleColor: 'text-red-900',
    bar: 'bg-red-400',
    label: 'Cancellation',
  },
};

const FALLBACK_CONFIG = {
  icon: Info,
  bg: 'bg-gray-50 border-gray-300',
  iconColor: 'text-gray-500',
  titleColor: 'text-gray-900',
  bar: 'bg-gray-400',
  label: 'Notification',
};

const AUTO_DISMISS_MS = 8000;

const SingleToast = ({ toast, onDismiss }) => {
  const cfg = EVENT_CONFIG[toast.event] || FALLBACK_CONFIG;
  const Icon = cfg.icon;
  const [progress, setProgress] = useState(100);
  const hovering = useRef(false);
  const startTime = useRef(Date.now());
  const elapsed = useRef(0);
  const rafId = useRef(null);

  const canViewBooking = !!toast.relatedId;

  const handleViewBooking = () => {
    window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { bookingId: String(toast.relatedId) } }));
    onDismiss(toast.id);
  };

  useEffect(() => {
    const tick = () => {
      if (!hovering.current) {
        elapsed.current = Date.now() - startTime.current;
        const pct = Math.max(0, 100 - (elapsed.current / AUTO_DISMISS_MS) * 100);
        setProgress(pct);
        if (elapsed.current >= AUTO_DISMISS_MS) {
          onDismiss(toast.id);
          return;
        }
      } else {
        startTime.current = Date.now() - elapsed.current;
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`relative flex gap-3 w-80 rounded-xl shadow-xl border-l-4 p-4 ${cfg.bg} animate-in slide-in-from-right-4 fade-in duration-300`}
      onMouseEnter={() => { hovering.current = true; }}
      onMouseLeave={() => { hovering.current = false; startTime.current = Date.now() - elapsed.current; }}
    >
      <div className="flex-shrink-0 pt-0.5">
        <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold leading-tight ${cfg.titleColor}`}>{toast.title}</p>
        {toast.body && (
          <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">{toast.body}</p>
        )}
        {canViewBooking && (
          <button
            onClick={handleViewBooking}
            className="mt-2 flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95"
          >
            <ExternalLink className="w-3 h-3" />
            View Booking
          </button>
        )}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-700 transition-colors self-start"
      >
        <X className="w-4 h-4" />
      </button>
      {/* progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden bg-black/5">
        <div
          className={`h-full ${cfg.bar} transition-none`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const NotificationToastContainer = ({ toasts, onDismiss }) => {
  if (!toasts.length) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto">
          <SingleToast toast={t} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default NotificationToastContainer;
