import { useEffect } from 'react';

const MinimalApp = () => {
  useEffect(() => {
    console.log('🚀 MinimalApp component mounted');
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      color: 'white', 
      background: '#030308',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🚀 Zankoku - Minimal Test</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ 
        border: '1px solid #1A1A2E', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        background: '#080812'
      }}>
        <h2>✅ React Rendering Test</h2>
        <p>React components are rendering correctly.</p>
      </div>
      <div style={{ 
        border: '1px solid #1A1A2E', 
        padding: '20px', 
        margin: '20px 0',
        borderRadius: '8px',
        background: '#080812'
      }}>
        <h2>📍 Current Status</h2>
        <ul>
          <li>✅ HTML structure working</li>
          <li>✅ JavaScript executing</li>
          <li>✅ React components mounting</li>
          <li>🔍 Investigating full app...</li>
        </ul>
      </div>
    </div>
  );
};

export default MinimalApp;
