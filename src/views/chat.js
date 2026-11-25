import { getCharacterById } from '../config/characters.js';
import { getChat } from '../chat/chatState.js';
import { validateMessage, createMessage, buildPayload, normalizeReply, MAX_MESSAGE_LENGTH } from '../chat/chatLogic.js';
import { sendWithRetry } from '../chat/retry.js';
import { sendChat } from '../services/chatApi.js';
import { renderMessages, setStatus, setFormDisabled } from '../ui/chatUi.js';
import { getUserMessage } from '../utils/errors.js';

export function renderChat(app) {
  const params = new URLSearchParams(window.location.search);
  const character = getCharacterById(params.get('personaje'));
  const chat = getChat(character.id);

  app.innerHTML = `
    <section class="chat" aria-label="Chat con ${character.displayName}">
      <div class="chat__header">
        <h1>Chat con ${character.displayName}</h1>
        <a href="/home">Cambiar de personaje</a>
      </div>
      <div class="chat__messages" id="messages" aria-live="polite"></div>
      <p class="chat__status" id="chat-status"></p>
      <form class="chat__form" id="chat-form" data-character="${character.id}">
        <input
          class="chat__input"
          id="chat-input"
          type="text"
          placeholder="Escribe tu mensaje..."
          autocomplete="off"
          maxlength="${MAX_MESSAGE_LENGTH}"
          aria-label="Mensaje"
        >
        <button class="btn" type="submit">Enviar</button>
      </form>
    </section>
  `;

  const elements = getChatElements(character.id);
  renderMessages(elements.messages, chat.messages, character.displayName);

  if (chat.isLoading) {
    setFormDisabled(elements, true);
    setStatus(elements.status, `${character.displayName} está escribiendo...`);
  }

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSend(character, chat);
  });

  elements.input.focus();
}

function getChatElements(characterId) {
  const form = document.querySelector('#chat-form');
  if (!form || form.dataset.character !== characterId) return null;
  return {
    form,
    messages: document.querySelector('#messages'),
    status: document.querySelector('#chat-status'),
    input: document.querySelector('#chat-input'),
    button: form.querySelector('button'),
  };
}

async function handleSend(character, chat) {
  if (chat.isLoading) return;

  let elements = getChatElements(character.id);
  const text = validateMessage(elements.input.value);
  if (!text) {
    setStatus(elements.status, 'Escribe un mensaje antes de enviar.', true);
    return;
  }

  chat.messages.push(createMessage('user', text));
  chat.isLoading = true;
  elements.input.value = '';
  renderMessages(elements.messages, chat.messages, character.displayName);
  setFormDisabled(elements, true);
  setStatus(elements.status, `${character.displayName} está escribiendo...`);

  let errorMessage = '';
  try {
    const payload = buildPayload(character.id, chat.messages);
    const data = await sendWithRetry(sendChat, payload, (seconds) => {
      const current = getChatElements(character.id);
      if (current) setStatus(current.status, `Demasiadas solicitudes. Reintentando en ${seconds} s...`);
    });
    chat.messages.push(createMessage('assistant', normalizeReply(data)));
  } catch (error) {
    chat.messages.pop();
    errorMessage = getUserMessage(error);
  } finally {
    chat.isLoading = false;
  }

  elements = getChatElements(character.id);
  if (!elements) return;

  renderMessages(elements.messages, chat.messages, character.displayName);
  setFormDisabled(elements, false);
  setStatus(elements.status, errorMessage, errorMessage !== '');
  if (errorMessage) elements.input.value = text;
  elements.input.focus();
}