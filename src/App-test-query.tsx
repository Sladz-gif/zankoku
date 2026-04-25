import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Simple test component that uses React Query
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
        🚀 React Query Test
      </h1>
      <p>QueryClient and React Query are working!</p>
      <div style={{ 
        marginTop: '20px',
        padding: '20px',
        border: '1px solid #00FF88',
        borderRadius: '8px',
        background: 'rgba(0, 255, 136, 0.1)'
      }}>
        <p>✅ React Router</p>
        <p>✅ React Query (QueryClient)</p>
        <p>🔍 Testing next component...</p>
      </div>
    </div>
  );
};

const TestQueryApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TestPage />} />
          <Route path="*" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default TestQueryApp;
