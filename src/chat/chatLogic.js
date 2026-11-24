export const MAX_MESSAGE_LENGTH = 500;

export function validateMessage(text) {
  const trimmed = (text ?? '').trim();
  if (trimmed === '') return null;
  return trimmed.slice(0, MAX_MESSAGE_LENGTH);
}

export function createMessage(role, content) {
  return { role, content };
}

export function buildPayload(characterId, messages) {
  return {
    characterId,
    messages: messages.map(({ role, content }) => ({ role, content })),
  };
}

export function normalizeReply(data) {
  const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
  if (reply === '') {
    const error = new Error('Empty reply');
    error.code = 'EMPTY_REPLY';
    throw error;
  }
  return reply;
}