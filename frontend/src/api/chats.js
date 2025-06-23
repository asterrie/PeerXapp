import { apiFetch } from './apiClient';

// Pobierz wiadomości prywatne z użytkownikiem o userId
export async function getPrivateMessages(token, userId) {
  return apiFetch(`/chats/${userId}`, 'GET', token);
}

// Wyślij wiadomość prywatną do użytkownika o userId
export async function sendPrivateMessage(token, userId, content) {
  return apiFetch(`/chats/${userId}`, 'POST', token, { content });
}
