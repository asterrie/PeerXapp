export default async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Błąd sieci');
  }
  return res.json();
}
