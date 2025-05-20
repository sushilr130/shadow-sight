
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Make sure we have a proper error handler
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Mount the application
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find the root element");
}

createRoot(rootElement).render(<App />);