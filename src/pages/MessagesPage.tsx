import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const MessagesPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackToFeed = () => {
    navigate('/feed');
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-base)',
      padding: '40px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        maxWidth: '400px'
      }}>
        <MessageSquare 
          size={64} 
          color="var(--neon-purple)" 
          style={{ opacity: 0.6, marginBottom: '24px' }} 
        />
        <h2 style={{
          fontFamily: 'Orbitron, monospace',
          fontWeight: 900,
          fontSize: '24px',
          color: 'var(--text-primary)',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          Coming Soon
        </h2>
        <p style={{
          fontFamily: 'Rajdhani, sans-serif',
          fontSize: '16px',
          color: 'var(--text-secondary)',
          lineHeight: '1.6',
          marginBottom: '32px'
        }}>
          Real-time messaging is under development. Get ready for epic conversations with fellow warriors!
        </p>
        <button
          onClick={handleBackToFeed}
          style={{
            padding: '12px 24px',
            background: 'var(--neon-purple)',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ←
        </button>
      </div>
    </div>
  );
};

export default MessagesPage;
