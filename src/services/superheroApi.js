import { fetchJson } from './http.js';

const BASE_URL = 'https://akabab.github.io/superhero-api/api';

export function getHeroById(apiId) {
  return fetchJson(`${BASE_URL}/id/${apiId}.json`);
}