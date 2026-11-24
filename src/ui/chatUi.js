export function renderMessages(container, messages, characterName) {
  container.replaceChildren();

  if (messages.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'chat__status';
    empty.textContent = `Saluda a ${characterName} para empezar.`;
    container.append(empty);
    return;
  }

  for (const message of messages) {
    const bubble = document.createElement('p');
    const variant = message.role === 'user' ? 'user' : 'bot';
    bubble.className = `message message--${variant}`;
    bubble.textContent = message.content;
    container.append(bubble);
  }

  container.scrollTop = container.scrollHeight;
}

export function setStatus(element, text, isError = false) {
  element.textContent = text;
  element.classList.toggle('chat__status--error', isError);
}

export function setFormDisabled(elements, disabled) {
  elements.input.disabled = disabled;
  elements.button.disabled = disabled;
}