import { createRoot } from "react-dom/client";
import App from "./App-minimal.tsx";
import "./index.css";

// Debug logging
console.log('🚀 main.tsx loading...');
console.log('📍 Root element:', document.getElementById("root"));

// Error boundary component
const ErrorBoundary = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
};

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('❌ Root element not found!');
    document.body.innerHTML = '<div style="color: white; padding: 20px;">Error: Root element not found</div>';
  } else {
    console.log('✅ Root element found, creating root...');
    const root = createRoot(rootElement);
    console.log('✅ Root created, rendering app...');
    root.render(<ErrorBoundary><App /></ErrorBoundary>);
    console.log('✅ App rendered successfully');
  }
} catch (error) {
  console.error('❌ Error rendering app:', error);
  document.body.innerHTML = `<div style="color: white; padding: 20px;">Error: ${error.message}</div>`;
}
