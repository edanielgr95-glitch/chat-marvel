const chats = {};

export function getChat(characterId) {
  if (!chats[characterId]) {
    chats[characterId] = { messages: [], isLoading: false };
  }
  return chats[characterId];
}