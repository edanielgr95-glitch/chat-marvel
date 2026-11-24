export async function fetchJson(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch {
    const error = new Error('Network request failed');
    error.code = 'NETWORK';
    throw error;
  }

   if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.status = response.status;
    const retryAfter = Number(response.headers.get('retry-after'));
    if (retryAfter > 0) error.retryAfter = retryAfter;
    throw error;
  }

  const data = await response.json();
  return data;
}