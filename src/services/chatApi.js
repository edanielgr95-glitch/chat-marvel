import { fetchJson } from './http.js';
import { sendChatMock } from './chatApi.mock.js';
import { USE_MOCK } from '../config/app.js';

export function sendChat(payload) {
  if (USE_MOCK) return sendChatMock(payload);

  return fetchJson('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}