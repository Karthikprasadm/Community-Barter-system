import { setBroadcastUpdate, setBroadcastActivityLogUpdate } from '../src/app';

// No-op functions for test environment
declare const global: any;
setBroadcastUpdate(() => {});
setBroadcastActivityLogUpdate(() => {});
