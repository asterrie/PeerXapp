export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString(); // lub np. date.toLocaleTimeString();
}
