import { apiFetch } from './apiClient';

export function getMessagesWithUser(token, userId) {
  return apiFetch(`/chats/${userId}`, 'GET', token);
}

export function sendMessage(token, toUserId, content) {
  return apiFetch('/chats', 'POST', token, { toUserId, content });
}
