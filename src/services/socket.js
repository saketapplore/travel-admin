import { io } from 'socket.io-client';

/**
 * Single shared Socket.IO connection to the backend for real-time admin
 * notifications. Authenticated with the admin JWT (same token as the REST API).
 */

let socket = null;

// Resolve the server origin (without the /api/admin path) for the socket.
const getSocketUrl = () => {
  const raw =
    import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    'https://travel-rumours-api.applore.in/';
  try {
    return new URL(raw).origin;
  } catch {
    return raw;
  }
};

const getToken = () => {
  try {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser).token : null;
  } catch {
    return null;
  }
};

export const connectSocket = () => {
  const token = getToken();
  if (!token) return null;

  if (socket && socket.connected) return socket;

  // Tear down a stale instance before reconnecting (e.g. after re-login).
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 2000
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
