// src/polyfills.ts
import { randomUUID } from 'crypto';

if (!(global as any).crypto) {
  (global as any).crypto = {
    randomUUID,
  };
}
