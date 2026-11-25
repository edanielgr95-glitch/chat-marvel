import { CHARACTER_LIST } from '../config/characters.js';

export function renderAbout(app) {
  const items = CHARACTER_LIST
    .map((character) => `<li><strong>${character.displayName}</strong>: ${character.tagline}</li>`)
    .join('');

  app.innerHTML = `
    <section>
      <h1>Sobre el proyecto</h1>
      <p>Prueba de concepto de ComicSansCon: una SPA para chatear con científicos de Marvel usando Google Gemini a través de una función serverless de Vercel.</p>
      <h2>Personajes</h2>
      <ul>${items}</ul>
      <p>Las fotos y los alias de las tarjetas vienen de la Superhero API. Cada personaje tiene su propio system prompt, guardado en el servidor.</p>
      <p><a href="/home">Volver a la galería</a></p>
    </section>
  `;
}