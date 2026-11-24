export function renderNotFound(app) {
  app.innerHTML = `
    <section>
      <h1>404 - Página no encontrada</h1>
      <p>La ruta "<span id="bad-path"></span>" no existe.</p>
      <p><a href="/home">Volver al inicio</a></p>
    </section>
  `;
  app.querySelector('#bad-path').textContent = window.location.pathname;
}