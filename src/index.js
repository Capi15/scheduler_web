// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

// IMPORTA OS PROVIDERS
import { AuthProvider } from './services/context/AuthContext';
import { TopBarProvider } from './services/context/TopBarContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <TopBarProvider>
        <Router>
          <App />
        </Router>
      </TopBarProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();