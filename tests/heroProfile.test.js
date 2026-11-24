import { describe, it, expect } from 'vitest';
import { toHeroProfile } from '../src/transform/heroProfile.js';

describe('toHeroProfile', () => {
  it('extrae los campos anidados del JSON de la API', () => {
    const raw = {
      name: 'Iron Man',
      biography: { fullName: 'Tony Stark' },
      work: { occupation: 'Inventor', base: 'Nueva York' },
      images: { md: 'https://example.com/ironman.jpg' },
    };

    expect(toHeroProfile(raw)).toEqual({
      heroName: 'Iron Man',
      fullName: 'Tony Stark',
      occupation: 'Inventor',
      base: 'Nueva York',
      image: 'https://example.com/ironman.jpg',
    });
  });

  it('usa valores por defecto cuando faltan datos', () => {
    const profile = toHeroProfile({ name: 'Test', work: null });

    expect(profile.fullName).toBe('Desconocido');
    expect(profile.base).toBe('Desconocido');
    expect(profile.image).toBe('');
  });

  it('no se rompe si recibe undefined', () => {
    expect(() => toHeroProfile(undefined)).not.toThrow();
  });
});