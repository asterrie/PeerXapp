import React, { useState } from 'react';

export default function Tabs({ tabs, onSelect }) {
  const [activeIndex, setActiveIndex] = useState(0);

  function handleClick(index) {
    setActiveIndex(index);
    if (onSelect) onSelect(tabs[index]);
  }

  return (
    <div style={{ display: 'flex', borderBottom: '2px solid #ccc', marginBottom: 20 }}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          onClick={() => handleClick(index)}
          style={{
            padding: '10px 20px',
            cursor: 'pointer',
            borderBottom: activeIndex === index ? '3px solid #4caf50' : 'none',
            fontWeight: activeIndex === index ? 'bold' : 'normal',
            color: activeIndex === index ? '#4caf50' : '#555',
          }}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
