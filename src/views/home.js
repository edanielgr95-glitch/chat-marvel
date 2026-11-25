import { DEFAULT_CHARACTER } from '../config/characters.js';
import { getHeroById } from '../services/superheroApi.js';
import { toHeroProfile } from '../transform/heroProfile.js';
import { renderHeroCard } from '../ui/heroCard.js';
import { getUserMessage } from '../utils/errors.js';

export function renderHome(app) {
  app.innerHTML = `
    <section>
      <h1>Chatea con los científicos de Marvel</h1>
      <p>Habla con Tony Stark, el genio detrás de la armadura de Iron Man.</p>
    </section>
    <div id="character-card" aria-live="polite"></div>
    <a href="/chat" class="btn">Empezar a chatear</a>
  `;

  loadHeroCard(app.querySelector('#character-card'));
}

async function loadHeroCard(container) {
  container.innerHTML = '<p class="chat__status">Cargando personaje...</p>';

  try {
    const raw = await getHeroById(DEFAULT_CHARACTER.apiId);
        const profile = { ...toHeroProfile(raw), tagline: DEFAULT_CHARACTER.tagline };
    if (!container.isConnected) return;
    renderHeroCard(container, profile);
  } catch (error) {
    if (!container.isConnected) return;
    container.innerHTML = `
      <p class="chat__status chat__status--error"></p>
      <button class="btn" type="button">Reintentar</button>
    `;
    container.querySelector('p').textContent = getUserMessage(error);
    container.querySelector('button').addEventListener('click', () => loadHeroCard(container));
  }
}