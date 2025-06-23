import { apiFetch } from './apiClient';

export function getUserProfile(token) {
  return apiFetch('/users/profile', 'GET', token);
}

export function getUsers(token) {
  return apiFetch('/users', 'GET', token);
}

export function addFriend(token, friendId) {
  return apiFetch(`/users/friends/${friendId}`, 'POST', token);
}
