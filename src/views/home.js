import { CHARACTER_LIST } from '../config/characters.js';
import { getHeroById } from '../services/superheroApi.js';
import { toHeroProfile } from '../transform/heroProfile.js';
import { renderHeroCard } from '../ui/heroCard.js';

export function renderHome(app) {
  app.innerHTML = `
    <section>
      <h1>Chatea con los científicos de Marvel</h1>
      <p>Elige con qué genio quieres conversar.</p>
    </section>
    <div class="gallery" id="gallery" aria-live="polite"></div>
  `;

  loadGallery(app.querySelector('#gallery'));
}

async function loadGallery(container) {
  container.innerHTML = '<p class="chat__status">Cargando personajes...</p>';

  const results = await Promise.allSettled(
    CHARACTER_LIST.map((character) => getHeroById(character.apiId))
  );

  if (!container.isConnected) return;
  container.replaceChildren();

  CHARACTER_LIST.forEach((character, index) => {
    const result = results[index];
    const apiProfile = result.status === 'fulfilled' ? toHeroProfile(result.value) : null;

    const profile = {
      heroName: apiProfile?.heroName ?? character.displayName,
      fullName: apiProfile?.fullName ?? character.displayName,
      image: apiProfile?.image ?? '',
      tagline: character.tagline,
    };

    const item = document.createElement('div');
    item.className = 'gallery__item';
    renderHeroCard(item, profile);

    const params = new URLSearchParams({ personaje: character.id });
    const link = document.createElement('a');
    link.className = 'btn';
    link.href = `/chat?${params}`;
    link.textContent = `Chatear con ${character.displayName}`;
    item.append(link);

    container.append(item);
  });
}