export function renderChat(app) {
  app.innerHTML = `
    <section class="chat" aria-label="Chat con Tony Stark">
      <div class="chat__messages" id="messages" aria-live="polite"></div>
      <p class="chat__status" id="chat-status"></p>
      <form class="chat__form" id="chat-form">
        <input
          class="chat__input"
          id="chat-input"
          type="text"
          placeholder="Escribe tu mensaje..."
          autocomplete="off"
          aria-label="Mensaje"
        >
        <button class="btn" type="submit">Enviar</button>
      </form>
    </section>
  `;
}