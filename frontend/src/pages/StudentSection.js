import React, { useState } from 'react';
import { styles } from './components/styles';
import MentorPicker from './MentorPicker';
import StudentRooms from './StudentRooms';

export default function StudentSection() {
  const [section, setSection] = useState('mentor');

  return (
    <>
      <div style={styles.subTabBar}>
        <button style={section === 'mentor' ? styles.subTabActive : styles.subTab} onClick={() => setSection('mentor')}>
          Wybierz mentora
        </button>
        <button style={section === 'rooms' ? styles.subTabActive : styles.subTab} onClick={() => setSection('rooms')}>
          Czatroomy
        </button>
      </div>
      {section === 'mentor' ? <MentorPicker /> : <StudentRooms />}
    </>
  );
}
