// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // 선택사항 (없다면 삭제)
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
