import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';  // ← Phải có dòng này!
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);