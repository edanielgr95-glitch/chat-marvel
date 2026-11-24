const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function sendWithRetry(sendFn, payload, onRetry) {
  try {
    return await sendFn(payload);
  } catch (error) {
    if (error?.status !== 429) throw error;

    const seconds = error.retryAfter ?? 3;
    onRetry?.(seconds);
    await wait(seconds * 1000);
    return sendFn(payload);
  }
}