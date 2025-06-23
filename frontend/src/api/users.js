import { apiFetch } from './apiClient';

// Pobierz dane aktualnie zalogowanego użytkownika
export async function getCurrentUser(token) {
  return apiFetch('/users/me', 'GET', token);
}
