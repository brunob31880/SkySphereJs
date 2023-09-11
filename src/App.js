import React from 'react';
import './App.css';
import SkyDome from './components/SkyDome';
import ErrorBoundary from './ErrorBoundary';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { SkyProvider } from './contexts/Skycontext';

function App() {
  return (
    <div className="App">
      <SkyProvider>
        <ErrorBoundary>
          <Header />
          <div className="content">
            <SkyDome />
          </div>
          <Sidebar />
        </ErrorBoundary>
      </SkyProvider>
    </div>
  );
}

export default App;
