import { DEFAULT_CHARACTER } from '../config/characters.js';
import { chatState } from '../chat/chatState.js';
import { validateMessage, createMessage, buildPayload, normalizeReply, MAX_MESSAGE_LENGTH } from '../chat/chatLogic.js';
import { sendWithRetry } from '../chat/retry.js';
import { sendChat } from '../services/chatApi.js';
import { renderMessages, setStatus, setFormDisabled } from '../ui/chatUi.js';
import { getUserMessage } from '../utils/errors.js';

const NAME = DEFAULT_CHARACTER.displayName;

export function renderChat(app) {
  app.innerHTML = `
    <section class="chat" aria-label="Chat con ${NAME}">
      <div class="chat__messages" id="messages" aria-live="polite"></div>
      <p class="chat__status" id="chat-status"></p>
      <form class="chat__form" id="chat-form">
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

  const elements = getChatElements();
  renderMessages(elements.messages, chatState.messages, NAME);

  if (chatState.isLoading) {
    setFormDisabled(elements, true);
    setStatus(elements.status, `${NAME} está escribiendo...`);
  }

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSend();
  });

  elements.input.focus();
}

function getChatElements() {
  const form = document.querySelector('#chat-form');
  if (!form) return null;
  return {
    form,
    messages: document.querySelector('#messages'),
    status: document.querySelector('#chat-status'),
    input: document.querySelector('#chat-input'),
    button: form.querySelector('button'),
  };
}

async function handleSend() {
  if (chatState.isLoading) return;

  let elements = getChatElements();
  const text = validateMessage(elements.input.value);
  if (!text) {
    setStatus(elements.status, 'Escribe un mensaje antes de enviar.', true);
    return;
  }

  chatState.messages.push(createMessage('user', text));
  chatState.isLoading = true;
  elements.input.value = '';
  renderMessages(elements.messages, chatState.messages, NAME);
  setFormDisabled(elements, true);
  setStatus(elements.status, `${NAME} está escribiendo...`);

  let errorMessage = '';
  try {
    const payload = buildPayload(DEFAULT_CHARACTER.id, chatState.messages);
    const data = await sendWithRetry(sendChat, payload, (seconds) => {
      const current = getChatElements();
      if (current) setStatus(current.status, `Demasiadas solicitudes. Reintentando en ${seconds} s...`);
    });
    chatState.messages.push(createMessage('assistant', normalizeReply(data)));
  } catch (error) {
    chatState.messages.pop();
    errorMessage = getUserMessage(error);
  } finally {
    chatState.isLoading = false;
  }

  elements = getChatElements();
  if (!elements) return;

  renderMessages(elements.messages, chatState.messages, NAME);
  setFormDisabled(elements, false);
  setStatus(elements.status, errorMessage, errorMessage !== '');
  if (errorMessage) elements.input.value = text;
  elements.input.focus();
}