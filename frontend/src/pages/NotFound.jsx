import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div>
      <h2>404 - Nie znaleziono strony</h2>
      <Link to="/">Wróć na stronę główną</Link>
    </div>
  );
}
