import { apiFetch } from './apiClient';

export function login(credentials) {
  return apiFetch('/auth/login', 'POST', null, credentials);
}

export function register(data) {
  return apiFetch('/auth/register', 'POST', null, data);
}
