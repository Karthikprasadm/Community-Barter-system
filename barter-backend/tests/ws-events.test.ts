import { io as Client } from 'socket.io-client';
// @ts-ignore
const fetch = require('node-fetch');

console.log('[TEST DEBUG] ws-events.test.ts loaded');

import http from 'http';
import app from '../src/app';
import setupWebSocket from '../src/websocket';

import { setBroadcastUpdate, setBroadcastActivityLogUpdate } from '../src/app';
let server: http.Server;
let io: ReturnType<typeof setupWebSocket>;
let address: string;

beforeAll((done) => {
  server = http.createServer(app);
  io = setupWebSocket(app, server);
  setBroadcastUpdate(io.broadcastUpdate);
  setBroadcastActivityLogUpdate(io.broadcastActivityLogUpdate);
  server.listen(0, () => {
    const port = (server.address() as any).port;
    address = `http://localhost:${port}`;
    console.log(`[TEST DEBUG] Test server started on ${address}`);
    done();
  });
});

afterAll((done) => {
  if (io && io.io) io.io.close();
  server.close(done);
});

describe('WebSocket Integration', () => {
  it('should connect to the WebSocket server', (done) => {
    const client = Client(address, { path: '/socket.io' });
    let timeout: NodeJS.Timeout;
    function cleanupAndDone(error?: Error) {
      if (timeout) clearTimeout(timeout);
      if (client && client.connected) client.close();
      if (error) return done(error);
      done();
    }
    client.on('connect', () => {
      try {
        expect(client.connected).toBe(true);
        cleanupAndDone();
      } catch (err) {
        cleanupAndDone(err as Error);
      }
    });
    timeout = setTimeout(() => {
      cleanupAndDone(new Error('Timeout: WebSocket did not connect in time.'));
    }, 5000);
  });

  it('should emit item:created event via WebSocket when a new item is created', (done) => {
    jest.setTimeout(15000); // 15 seconds
    let clientConnected = false;
    let eventReceived = false;
    let timeout: NodeJS.Timeout;

    const client = Client(address, { path: '/socket.io' });
    const uniqueName = 'Test Item ' + Date.now();

    function cleanupAndDone(error?: Error) {
      if (timeout) clearTimeout(timeout);
      if (client && client.connected) client.close();
      if (error) return done(error);
      done();
    }

    client.on('connect', () => {
      clientConnected = true;
      console.log('[TEST DEBUG] WebSocket client connected:', client.id);
    });
    client.onAny((event, ...args) => {
      console.log('[TEST DEBUG] Received event:', event, args);
    });
    client.on('item:created', (data: any) => {
      try {
        eventReceived = true;
        expect(data).toBeDefined();
        expect(data.name).toBe(uniqueName);
        cleanupAndDone();
      } catch (err) {
        cleanupAndDone(err as Error);
      }
    });
    client.on('connect', async () => {
      try {
        // Create a test user first
        const userResp = await fetch(address + '/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'ws_test_user_' + Date.now(),
            email: `ws_test_user_${Date.now()}@example.com`,
            password: 'TestPassword123',
          }),
        });
        const user = await userResp.json();
        console.log('[TEST DEBUG] User creation response:', user);
        if (!user.id) {
          cleanupAndDone(new Error('Failed to create test user: ' + JSON.stringify(user)));
          return;
        }
        // Wait 500ms to ensure listener is ready
        setTimeout(async () => {
          try {
            const itemResp = await fetch(address + '/api/items', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: uniqueName,
                description: 'WebSocket test',
                category: 'Test',
                userId: user.id,
                condition: 'new',
              }),
            });
            const item = await itemResp.json();
            console.log('[TEST DEBUG] Item creation response:', item);
          } catch (err) {
            cleanupAndDone(err as Error);
          }
        }, 500);
      } catch (err) {
        cleanupAndDone(err as Error);
      }
      // Fail-safe timeout in case event is never received
      timeout = setTimeout(() => {
        if (!eventReceived) {
          if (!clientConnected) {
            cleanupAndDone(new Error('Timeout: WebSocket client never connected.'));
          } else {
            cleanupAndDone(new Error('Timeout: item:created event not received after item creation.'));
          }
        }
      }, 12000);
    });
  });
});
