import { io as Client } from 'socket.io-client';
// @ts-ignore
const fetch = require('node-fetch');

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

describe('Minimal WebSocket Sanity Test', () => {
  it('should receive item:created event after item creation', (done) => {
    jest.setTimeout(15000); // 15 seconds
    let clientConnected = false;
    let eventReceived = false; // Track if event is received
    let timeout: NodeJS.Timeout;

    const client = Client(address, { path: '/socket.io' });
    const uniqueName = 'Sanity Item ' + Date.now();

    function cleanupAndDone(error?: Error) {
      if (timeout) clearTimeout(timeout);
      if (client && client.connected) client.close();
      if (error) return done(error);
      done();
    }

    client.on('connect', () => {
      clientConnected = true;
      console.log('[TEST DEBUG] WebSocket client connected:', client.id);
      // Wait a bit to ensure listener is ready
      setTimeout(async () => {
        const userResp = await fetch(address + '/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: 'sanity_user_' + Date.now(),
            email: `sanity_user_${Date.now()}@example.com`,
            password: 'TestPassword123',
          }),
        });
        const user = await userResp.json();
        if (!user.id) {
          client.close();
          return done(new Error('Failed to create test user: ' + JSON.stringify(user)));
        }
        setTimeout(async () => {
          const itemResp = await fetch(address + '/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: uniqueName,
              description: 'Sanity WebSocket test',
              category: 'Test',
              userId: user.id,
              condition: 'new',
            }),
          });
          const item = await itemResp.json();
          if (!item.id) {
            client.close();
            return done(new Error('Failed to create test item: ' + JSON.stringify(item)));
          }
        }, 300);
      }, 300);
    });

    client.on('item:created', (data) => {
      try {
        eventReceived = true;
        console.log('[TEST DEBUG] Received item:created event:', data);
        expect(data).toBeDefined();
        expect(data.name).toContain('Sanity Item');
        cleanupAndDone();
      } catch (err) {
        cleanupAndDone(err as Error);
      }
    });

    // Fail-safe timeout
    timeout = setTimeout(() => {
      if (!eventReceived) {
        if (!clientConnected) {
          cleanupAndDone(new Error('Timeout: WebSocket client never connected.'));
        } else {
          cleanupAndDone(new Error('Timeout: item:created event not received in minimal sanity test.'));
        }
      }
    }, 12000);
  });
});
