try {
  const app = require('../src/app');
  console.log('app import: OK');
} catch (e) {
  console.error('app import error:', e);
}

try {
  const ws = require('../src/websocket');
  console.log('websocket import: OK');
} catch (e) {
  console.error('websocket import error:', e);
}
