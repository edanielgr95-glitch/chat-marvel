import { describe, it, expect } from 'vitest';
import { toGeminiContents, validateBody } from '../api/chat.js';
import { CHARACTER_LIST } from '../src/config/characters.js';

describe('toGeminiContents', () => {
  it('traduce assistant a model y content a parts', () => {
    const messages = [
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: '¿Qué tal?' },
    ];

    expect(toGeminiContents(messages)).toEqual([
      { role: 'user', parts: [{ text: 'Hola' }] },
      { role: 'model', parts: [{ text: '¿Qué tal?' }] },
    ]);
  });
});

describe('validateBody', () => {
  const validBody = {
    characterId: 'ironman',
    messages: [{ role: 'user', content: 'Hola' }],
  };

  it('acepta un cuerpo válido', () => {
    expect(validateBody(validBody)).toBeNull();
  });

  it('acepta a todos los personajes de la galería', () => {
    for (const character of CHARACTER_LIST) {
      expect(validateBody({ ...validBody, characterId: character.id })).toBeNull();
    }
  });

  it('rechaza personajes desconocidos, roles inválidos y cuerpos vacíos', () => {
    expect(validateBody({ ...validBody, characterId: 'thanos' })).toBe('Personaje no válido');
    expect(validateBody({ ...validBody, messages: [{ role: 'system', content: 'x' }] })).toBe('Formato de mensajes inválido');
    expect(validateBody(undefined)).toBe('Personaje no válido');
  });
});