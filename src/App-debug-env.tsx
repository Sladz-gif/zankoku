import { useEffect } from 'react';

const DebugEnvApp = () => {
  useEffect(() => {
    console.log('🚀 DebugEnvApp component mounted');
    console.log('📍 Environment Info:');
    console.log('🌐 NODE_ENV:', import.meta.env.NODE_ENV);
    console.log('🔧 MODE:', import.meta.env.MODE);
    console.log('🌍 DEV:', import.meta.env.DEV);
    console.log('🏭 PROD:', import.meta.env.PROD);
    console.log('🔑 SUPABASE_URL present:', !!import.meta.env.VITE_SUPABASE_URL);
    console.log('🔐 SUPABASE_ANON_KEY present:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      color: 'white', 
      background: 'linear-gradient(135deg, #030308 0%, #1A1A2E 100%)',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '20px',
        color: '#00FF88',
        textShadow: '0 0 20px rgba(0, 255, 136, 0.5)'
      }}>
        🔍 Environment Debug Test
      </h1>
      
      <div style={{ 
        border: '2px solid #FFD700', 
        padding: '30px', 
        margin: '20px 0',
        borderRadius: '12px',
        background: 'rgba(255, 215, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#FFD700', marginBottom: '15px' }}>
          🌍 Environment Information
        </h2>
        <div style={{ textAlign: 'left', fontSize: '16px', lineHeight: '1.8' }}>
          <p><strong>NODE_ENV:</strong> {import.meta.env.NODE_ENV || 'undefined'}</p>
          <p><strong>MODE:</strong> {import.meta.env.MODE || 'undefined'}</p>
          <p><strong>DEV:</strong> {import.meta.env.DEV ? 'true' : 'false'}</p>
          <p><strong>PROD:</strong> {import.meta.env.PROD ? 'true' : 'false'}</p>
        </div>
      </div>
      
      <div style={{ 
        border: '2px solid #FF6B6B', 
        padding: '30px', 
        margin: '20px 0',
        borderRadius: '12px',
        background: 'rgba(255, 107, 107, 0.1)',
        backdropFilter: 'blur(10px)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#FF6B6B', marginBottom: '15px' }}>
          🔑 Environment Variables
        </h2>
        <div style={{ textAlign: 'left', fontSize: '16px', lineHeight: '1.8' }}>
          <p><strong>VITE_SUPABASE_URL:</strong> {import.meta.env.VITE_SUPABASE_URL ? '✅ Present' : '❌ Missing'}</p>
          <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}</p>
        </div>
      </div>
      
      <div style={{ 
        border: '2px solid #4ECDC4', 
        padding: '30px', 
        margin: '20px 0',
        borderRadius: '12px',
        background: 'rgba(78, 205, 196, 0.1)',
        backdropFilter: 'blur(10px)',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#4ECDC4', marginBottom: '15px' }}>
          🎯 Debug Status
        </h2>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
          If you can see this page, React is working in production!
          Check the console for detailed environment information.
        </p>
      </div>
    </div>
  );
};

export default DebugEnvApp;
