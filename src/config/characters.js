export const CHARACTERS = {
  ironman: {
    id: 'ironman',
    apiId: 346,
    displayName: 'Tony Stark',
    tagline: 'Genio, inventor, millonario y miembro fundador de los Avengers.',
  },
  reed: {
    id: 'reed',
    apiId: 456,
    displayName: 'Reed Richards',
    tagline: 'Científico brillante y líder de los Cuatro Fantásticos, capaz de estirar su cuerpo a voluntad.',
  },
  banner: {
    id: 'banner',
    apiId: 332,
    displayName: 'Bruce Banner',
    tagline: 'Físico experto en radiación gamma que, cuando pierde el control, se convierte en Hulk.',
  },
};

export const CHARACTER_LIST = Object.values(CHARACTERS);

export const DEFAULT_CHARACTER = CHARACTERS.ironman;

export function getCharacterById(id) {
  return CHARACTERS[id] ?? DEFAULT_CHARACTER;
}