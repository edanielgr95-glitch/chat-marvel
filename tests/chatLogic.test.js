import { describe, it, expect, vi } from 'vitest';
import { validateMessage, buildPayload, normalizeReply, MAX_MESSAGE_LENGTH } from '../src/chat/chatLogic.js';
import { sendWithRetry } from '../src/chat/retry.js';

describe('validateMessage', () => {
  it('devuelve null si el texto está vacío o solo tiene espacios', () => {
    expect(validateMessage('')).toBeNull();
    expect(validateMessage('   ')).toBeNull();
    expect(validateMessage(undefined)).toBeNull();
  });

  it('recorta espacios y limita la longitud', () => {
    expect(validateMessage('  hola  ')).toBe('hola');
    expect(validateMessage('a'.repeat(600))).toHaveLength(MAX_MESSAGE_LENGTH);
  });
});

describe('buildPayload', () => {
  it('envía el historial completo solo con role y content', () => {
    const messages = [
      { role: 'user', content: 'hola', extra: 'no debe viajar' },
      { role: 'assistant', content: 'qué tal' },
      { role: 'user', content: 'otra pregunta' },
    ];

    expect(buildPayload('ironman', messages)).toEqual({
      characterId: 'ironman',
      messages: [
        { role: 'user', content: 'hola' },
        { role: 'assistant', content: 'qué tal' },
        { role: 'user', content: 'otra pregunta' },
      ],
    });
  });
});

describe('normalizeReply', () => {
  it('devuelve el texto sin espacios extra', () => {
    expect(normalizeReply({ reply: '  Soy Tony Stark  ' })).toBe('Soy Tony Stark');
  });

  it('lanza un error si la respuesta no trae texto', () => {
    expect(() => normalizeReply({})).toThrow('Empty reply');
    expect(() => normalizeReply({ reply: 42 })).toThrow('Empty reply');
  });
});

describe('sendWithRetry', () => {
  it('reintenta una vez ante un 429 y devuelve la segunda respuesta', async () => {
    const rateLimit = Object.assign(new Error('HTTP 429'), { status: 429, retryAfter: 0.01 });
    const sendFn = vi.fn()
      .mockRejectedValueOnce(rateLimit)
      .mockResolvedValueOnce({ reply: 'ok' });
    const onRetry = vi.fn();

    const result = await sendWithRetry(sendFn, { messages: [] }, onRetry);

    expect(result).toEqual({ reply: 'ok' });
    expect(sendFn).toHaveBeenCalledTimes(2);
    expect(onRetry).toHaveBeenCalledWith(0.01);
  });

  it('no reintenta errores que no son 429', async () => {
    const serverError = Object.assign(new Error('HTTP 500'), { status: 500 });
    const sendFn = vi.fn().mockRejectedValue(serverError);

    await expect(sendWithRetry(sendFn, {})).rejects.toThrow('HTTP 500');
    expect(sendFn).toHaveBeenCalledTimes(1);
  });
});