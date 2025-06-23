import { apiFetch } from './apiClient';

export function getRooms(token) {
  return apiFetch('/rooms', 'GET', token);
}

export function createRoom(token, data) {
  return apiFetch('/rooms', 'POST', token, data);
}

export function getRoomMessages(token, roomId) {
  return apiFetch(`/rooms/${roomId}/messages`, 'GET', token);
}

export function sendRoomMessage(token, roomId, content) {
  return apiFetch(`/rooms/${roomId}/messages`, 'POST', token, { content });
}
