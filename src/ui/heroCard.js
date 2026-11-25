export function renderHeroCard(container, profile) {
  container.innerHTML = `
    <article class="character-card">
      <img class="character-card__img" width="128" height="128">
      <div>
        <h2 class="character-card__name"></h2>
        <p class="character-card__alias"></p>
        <p class="character-card__info"></p>
      </div>
    </article>
  `;

  const img = container.querySelector('.character-card__img');
  if (profile.image) {
    img.src = profile.image;
    img.alt = `Retrato de ${profile.heroName}`;
  } else {
    img.hidden = true;
  }

  container.querySelector('.character-card__name').textContent = profile.fullName;
  container.querySelector('.character-card__alias').textContent = profile.heroName;
    container.querySelector('.character-card__info').textContent =
    profile.tagline ?? `${profile.occupation} · Base: ${profile.base}`;
}