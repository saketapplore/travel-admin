import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

const timeAgo = (date) => {
  if (!date) return '';
  const diff = Date.now() - new Date(date).getTime();
  if (Number.isNaN(diff)) return '';
  const s = Math.floor(diff / 1000);
  if (s < 60) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
};

const EVENT_DOT = {
  voucher_failed: 'bg-amber-500',
  voucher_quarantined: 'bg-red-600',
  voucher_generated: 'bg-green-500',
  new_booking: 'bg-blue-500',
  cancellation: 'bg-red-500',
};

const ViewBookingAction = ({ bookingId }) => {
  const handle = (e) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('open-booking-modal', { detail: { bookingId: String(bookingId) } }));
  };
  return (
    <button
      onClick={handle}
      className="mt-1.5 flex items-center gap-1 bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all active:scale-95"
    >
      <ExternalLink className="w-3 h-3" />
      View Booking
    </button>
  );
};

/**
 * A single top-bar notification bell with an unread badge and a dropdown
 * listing recent items. Opening the dropdown marks the bell read.
 */
const NotificationBell = ({ icon: Icon, label, bell }) => {
  const { items = [], unreadCount = 0 } = bell || {};
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0 && bell?.onOpen) bell.onOpen();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        title={label}
        aria-label={`${label}${unreadCount ? ` (${unreadCount} unread)` : ''}`}
        className="relative w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition duration-200 focus:outline-none focus:ring-2 focus:ring-white/60"
      >
        <Icon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 max-w-[90vw] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <Icon className="w-4 h-4 text-orange-500" />
            <p className="text-sm font-bold text-gray-800">{label}</p>
            {unreadCount > 0 && (
              <span className="ml-auto text-[11px] font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-gray-400">
                No notifications yet
              </div>
            ) : (
              items.map((n) => {
                const dotColor = EVENT_DOT[n.event] || 'bg-gray-400';
                const canVoucher = !!n.relatedId;
                return (
                  <div
                    key={n._id || `${n.createdAt}-${n.bookingRef}`}
                    className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3"
                  >
                    <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${dotColor}`} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 leading-snug">{n.title}</p>
                      {n.body && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                      {canVoucher && <ViewBookingAction bookingId={String(n.relatedId)} />}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
