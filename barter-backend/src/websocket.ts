import { Server } from "socket.io";
import http from "http";
import type { Express } from "express";

/**
 * Sets up a Socket.IO server for real-time data updates.
 * Call this after your Express app is created and server is started.
 */
export default function setupWebSocket(app: Express, server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: "*", // You may want to restrict this in production
    },
  });

  io.on("connection", (socket) => {
    const now = new Date().toISOString();
    console.log(`[WebSocket] Client connected: ${socket.id} at ${now}`);
    socket.on("disconnect", (reason) => {
      const ts = new Date().toISOString();
      console.log(`[WebSocket] Client disconnected: ${socket.id} at ${ts} (reason: ${reason})`);
    });
    // You can add more event listeners here if needed
  });

  // Utility: emit update events to all clients
  function broadcastUpdate(event: string, data: unknown) {
    const now = new Date().toISOString();
    console.log(`[WebSocket] Broadcasting event: '${event}' at ${now}`);
    console.log(`[WebSocket] Payload:`, JSON.stringify(data));
    io.emit(event, data);
  }

  // Utility: emit activity log update events
  function broadcastActivityLogUpdate(activityLogEntry: unknown) {
    const now = new Date().toISOString();
    console.log(`[WebSocket] Broadcasting event: 'activity_log_update' at ${now}`);
    console.log(`[WebSocket] Payload:`, JSON.stringify(activityLogEntry));
    io.emit('activity_log_update', activityLogEntry);
  }

  return {
    io,
    broadcastUpdate,
    broadcastActivityLogUpdate,
  };
}
