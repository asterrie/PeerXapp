import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', marginTop: 50 }}>
      <h1>404 - Strona nie znaleziona</h1>
      <p>Przepraszamy, ale strona, której szukasz, nie istnieje.</p>
      <Link to="/">Wróć do strony głównej</Link>
    </div>
  );
}
