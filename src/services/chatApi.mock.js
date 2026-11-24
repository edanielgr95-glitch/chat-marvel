const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let attempts429 = 0;

function httpError(status, retryAfter) {
  const error = new Error(`HTTP ${status}`);
  error.status = status;
  if (retryAfter) error.retryAfter = retryAfter;
  return error;
}

export async function sendChatMock(payload) {
  await wait(800);
  const last = payload.messages.at(-1)?.content ?? '';

  if (last === '/429') {
    attempts429 += 1;
    if (attempts429 % 2 === 1) throw httpError(429, 2);
  }
  if (last === '/429-siempre') throw httpError(429, 2);
  if (last === '/500') throw httpError(500);

  return {
    reply: `(Simulado) Recibí "${last}". Llevamos ${payload.messages.length} mensajes. Soy Tony Stark, obviamente.`,
  };
}