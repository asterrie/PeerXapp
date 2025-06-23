// src/api/auth.js
import { apiFetch } from './apiClient';

export async function registerUser(form) {
  return await apiFetch('/auth/register', 'POST', null, form);
}

export async function loginUser(credentials) {
  return await apiFetch('/auth/login', 'POST', null, credentials);
}
