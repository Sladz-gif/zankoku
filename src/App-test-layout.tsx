import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameProvider } from "@/context/GameContext";
import AppLayout from "@/components/layout/AppLayout";

const queryClient = new QueryClient();

// Simple test component that uses AppLayout
const TestPage = () => {
  return (
    <div style={{ 
      padding: '40px', 
      color: 'white', 
      background: '#030308',
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#00FF88', fontSize: '2rem' }}>
        🏗️ AppLayout Test
      </h1>
      <p>AppLayout and main application structure are working!</p>
      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #00FF88',
        borderRadius: '8px',
        background: 'rgba(0, 255, 136, 0.1)'
      }}>
        <p>✅ React Router</p>
        <p>✅ React Query (QueryClient)</p>
        <p>✅ GameContext (State Management)</p>
        <p>✅ AppLayout (Main Layout)</p>
        <p>🔍 Testing final component...</p>
      </div>
    </div>
  );
};

const TestLayoutApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GameProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<TestPage />} />
              <Route path="*" element={<TestPage />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </GameProvider>
    </QueryClientProvider>
  );
};

export default TestLayoutApp;
