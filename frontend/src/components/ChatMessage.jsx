import React from 'react';

export default function ChatMessages({ messages, currentUserId }) {
  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px', border: '1px solid #ccc', borderRadius: 8 }}>
      {messages.map(msg => {
        const isMine = msg.fromUserId === currentUserId;
        return (
          <div 
            key={msg._id} 
            style={{
              display: 'flex',
              justifyContent: isMine ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div style={{
              backgroundColor: isMine ? '#4caf50' : '#e0e0e0',
              color: isMine ? 'white' : 'black',
              padding: '8px 12px',
              borderRadius: 15,
              maxWidth: '70%',
              wordBreak: 'break-word'
            }}>
              {msg.content}
              <div style={{ fontSize: 10, marginTop: 4, opacity: 0.6 }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
