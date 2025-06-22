import React from 'react';
import { styles } from './Styles'; // poprawna ścieżka, bez błędów

export default function Tabs({ active, setActive }) {
  return (
    <div style={styles.tabBar}>
      <button
        style={active === 'students' ? styles.tabActive : styles.tab}
        onClick={() => setActive('students')}
      >
        Uczniowie
      </button>
      <button
        style={active === 'teachers' ? styles.tabActive : styles.tab}
        onClick={() => setActive('teachers')}
      >
        Nauczyciele
      </button>
    </div>
  );
}
