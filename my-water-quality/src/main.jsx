// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

// Import the Supabase test utility in development
if (import.meta.env.DEV) {
  import('./utils/supabaseTest')
    .then(() => console.log('Supabase test utilities loaded'))
    .catch(err => console.error('Failed to load Supabase test utilities:', err));
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);