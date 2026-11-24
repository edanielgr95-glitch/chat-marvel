export function renderAbout(app) {
  app.innerHTML = `
    <section>
      <h1>Sobre el proyecto</h1>
      <p>Prueba de concepto de ComicSansCon: una SPA para chatear con personajes de Marvel usando Google Gemini.</p>
      <h2>Personajes</h2>
      <ul>
        <li><strong>Tony Stark (Iron Man)</strong>: ingeniero, inventor y miembro fundador de los Avengers.</li>
      </ul>
      <p><a href="/home">Volver al inicio</a></p>
    </section>
  `;
}