import { useState, useEffect, useCallback, useRef } from 'react';
import { notificationService } from '../services/notificationService';
import { connectSocket, disconnectSocket } from '../services/socket';

const EMPTY = { items: [], unreadCount: 0 };
const MAX_ITEMS = 30;
const MAX_TOASTS = 5;
const SOCKET_EVENT = 'admin:notification';

let toastCounter = 0;

/**
 * Drives the two top-bar notification bells:
 *   - stays  → "Stay By TR"
 *   - travel → "Hotel & Flight"
 *
 * Loads recent history over REST, then keeps both bells live via Socket.IO.
 */
export const useAdminNotifications = () => {
  const [bells, setBells] = useState({ stays: { ...EMPTY }, travel: { ...EMPTY } });
  const [toasts, setToasts] = useState([]);
  const [connected, setConnected] = useState(false);
  const mounted = useRef(true);

  // Initial history load.
  const fetchAll = useCallback(async () => {
    try {
      const res = await notificationService.getAll();
      const data = res?.data?.data || {};
      if (!mounted.current) return;
      setBells({
        stays: data.stays || { ...EMPTY },
        travel: data.travel || { ...EMPTY }
      });
    } catch (err) {
      // Non-fatal: bells just stay empty until the next event.
      console.error('Failed to load notifications:', err?.message || err);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    fetchAll();

    const socket = connectSocket();
    if (socket) {
      const onConnect = () => mounted.current && setConnected(true);
      const onDisconnect = () => mounted.current && setConnected(false);
      const onNotification = (n) => {
        if (!mounted.current || !n?.source) return;
        // Update bell
        setBells((prev) => {
          const bell = prev[n.source] || { ...EMPTY };
          return {
            ...prev,
            [n.source]: {
              items: [n, ...bell.items].slice(0, MAX_ITEMS),
              unreadCount: bell.unreadCount + 1
            }
          };
        });
        // Show toast
        setToasts((prev) => {
          const id = ++toastCounter;
          return [{ ...n, id }, ...prev].slice(0, MAX_TOASTS);
        });
      };

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
      socket.on(SOCKET_EVENT, onNotification);
      if (socket.connected) setConnected(true);

      return () => {
        mounted.current = false;
        socket.off('connect', onConnect);
        socket.off('disconnect', onDisconnect);
        socket.off(SOCKET_EVENT, onNotification);
        disconnectSocket();
      };
    }

    return () => {
      mounted.current = false;
    };
  }, [fetchAll]);

  // Mark a bell read (called when its dropdown opens).
  const markRead = useCallback(async (source) => {
    setBells((prev) => ({
      ...prev,
      [source]: { ...(prev[source] || EMPTY), unreadCount: 0 }
    }));
    try {
      await notificationService.markRead(source);
    } catch (err) {
      console.error('Failed to mark notifications read:', err?.message || err);
    }
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { bells, toasts, dismissToast, connected, markRead, refresh: fetchAll };
};

export default useAdminNotifications;
