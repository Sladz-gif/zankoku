import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Simple test component
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
        🚀 Router Test
      </h1>
      <p>React Router is working!</p>
    </div>
  );
};

const TestRouterApp = () => {
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

export default TestRouterApp;
