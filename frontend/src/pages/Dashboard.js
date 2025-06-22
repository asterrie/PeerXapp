import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Tabs from './components/Tabs';
import { styles } from './components/styles';
import StudentSection from './StudentSection';
import TeacherSection from './TeacherSection';

export default function Dashboard() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState('students');

  if (!auth.user) return <p>Ładowanie profilu...</p>;

  return (
    <div style={styles.container}>
      <h2>Witaj, {auth.user.name}!</h2>
      <button onClick={auth.logout} style={styles.logout}>Wyloguj się</button>
      <Tabs active={activeTab} setActive={setActiveTab} />
      {activeTab === 'students' ? <StudentSection /> : <TeacherSection />}
    </div>
  );
}
