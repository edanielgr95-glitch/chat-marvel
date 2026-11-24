import { describe, it, expect, vi, afterEach } from 'vitest';
import { fetchJson } from '../src/services/http.js';

function fakeResponse({ ok = true, status = 200, data = {}, retryAfter = null } = {}) {
  return {
    ok,
    status,
    headers: { get: (name) => (name === 'retry-after' ? retryAfter : null) },
    json: async () => data,
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchJson', () => {
  it('devuelve los datos cuando la respuesta es ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeResponse({ data: { name: 'Iron Man' } })));

    const data = await fetchJson('/fake');

    expect(data).toEqual({ name: 'Iron Man' });
    expect(fetch).toHaveBeenCalledWith('/fake', {});
  });

  it('lanza un error con status 404 sin intentar leer el cuerpo como éxito', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeResponse({ ok: false, status: 404 })));

    const error = await fetchJson('/fake').catch((e) => e);

    expect(error.status).toBe(404);
  });

  it('lee retry-after cuando el servidor responde 429', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(fakeResponse({ ok: false, status: 429, retryAfter: '5' })));

    const error = await fetchJson('/fake').catch((e) => e);

    expect(error.status).toBe(429);
    expect(error.retryAfter).toBe(5);
  });

  it('marca los fallos de red con code NETWORK', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')));

    const error = await fetchJson('/fake').catch((e) => e);

    expect(error.code).toBe('NETWORK');
  });
});