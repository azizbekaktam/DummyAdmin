import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { GlobalProvider } from './store/GlobalContext';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <GlobalProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </GlobalProvider>
  </React.StrictMode>
);
