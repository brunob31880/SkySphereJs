import React, { useState, useEffect } from 'react';
import './App.css';
import SkyDome from './components/SkyDome';
import ErrorBoundary from './ErrorBoundary';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { SkyProvider } from './contexts/Skycontext';

function App() {
  const [deviceType, setDeviceType] = useState(getDeviceType(window.innerWidth));
/**
  * 
  * @param {*} width 
  * @returns 
  */
function getDeviceType(width) {
  console.log("Width="+width);
  if (width < 768) {
    return 'mobile';
  } else if (width <= 1180) {
    return 'tablette';
  } else {
    return 'ordinateur';
  }
}
useEffect(() => {
  const handleResize = () => {
    setDeviceType(getDeviceType(window.innerWidth));
  };

  window.addEventListener('resize', handleResize);
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);


  return (
    <div className={`App ${deviceType === "mobile" ? "mobile" : ""}`}>
      <SkyProvider>
        <ErrorBoundary>
          <Header deviceType={deviceType} />
          <div className="content">
            <SkyDome />
          </div>
          {deviceType !== "mobile" && <Sidebar />}
        </ErrorBoundary>
      </SkyProvider>
    </div>
  );
}

export default App;
