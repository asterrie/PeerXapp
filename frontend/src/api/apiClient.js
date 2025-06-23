const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export async function apiFetch(endpoint, method = 'GET', token = null, body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const errorMessage = errorData.error || res.statusText || 'Błąd sieci';
    throw new Error(errorMessage);
  }

  if (res.status === 204) return null; // brak treści

  return res.json();
}
