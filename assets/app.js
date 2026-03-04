import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import './styles/app.css';

// Import bootstrap.js if needed or remove it
// import './bootstrap.js';

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.log('No root element found');
}
