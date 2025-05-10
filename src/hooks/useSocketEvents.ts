import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:15000';

// All event types for real-time updates
const ALL_EVENTS = [
  // Items
  'item:created', 'item:updated', 'item:deleted',
  // Users
  'user:created', 'user:updated', 'user:deleted',
  // Trades
  'trade:created', 'trade:updated', 'trade:deleted',
  // Offers (future-proof, if you add offer events)
  'offer:created', 'offer:updated', 'offer:deleted',
  // Ratings (future-proof, if you add rating events)
  'rating:created', 'rating:updated', 'rating:deleted',
];

export function useSocketEvents(eventHandlers: Partial<Record<string, (data: any) => void>>) {
  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socket.on('connect_error', (err) => {
      console.error('[SOCKET] Connection error:', err);
    });
    socket.on('connect', () => {
      console.log('[SOCKET] Connected:', socket.id);
    });
    socket.on('disconnect', (reason) => {
      console.warn('[SOCKET] Disconnected:', reason);
    });
    // Register all handlers provided
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (handler) socket.on(event, handler);
    });
    // Optionally: log all events for debugging
    ALL_EVENTS.forEach(event => {
      if (!eventHandlers[event]) {
        socket.on(event, data => {
          // console.log(`[SOCKET] ${event}:`, data);
        });
      }
    });
    // Clean up
    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        if (handler) socket.off(event, handler);
      });
      ALL_EVENTS.forEach(event => {
        if (!eventHandlers[event]) socket.off(event);
      });
      socket.disconnect();
    };
  }, [eventHandlers]);
}
