const UNKNOWN = 'Desconocido';

export function getFullName(raw) {
  return raw?.biography?.fullName ?? UNKNOWN;
}

export function getOccupation(raw) {
  return raw?.work?.occupation ?? UNKNOWN;
}

export function getBase(raw) {
  return raw?.work?.base ?? UNKNOWN;
}

export function getImageUrl(raw) {
  return raw?.images?.md ?? '';
}

export function toHeroProfile(raw) {
  return {
    heroName: raw?.name ?? UNKNOWN,
    fullName: getFullName(raw),
    occupation: getOccupation(raw),
    base: getBase(raw),
    image: getImageUrl(raw),
  };
}