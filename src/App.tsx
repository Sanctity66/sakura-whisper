import React, { useState } from 'react';
import SakuraBackground from './components/SakuraBackground';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import MobileDashboard from './mobile/MobileDashboard';
import { useIsMobile } from './hooks/useIsMobile';

const App: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="relative min-h-screen w-full font-sans selection:bg-pink-200 selection:text-pink-900">
      <SakuraBackground onLoad={() => setIsBackgroundLoaded(true)} />

      {/* Content Wrapper with Fade-In Transition */}
      <div className={`relative z-10 transition-opacity duration-1000 delay-500 ${isBackgroundLoaded ? 'opacity-100' : 'opacity-0'}`}>
        {/* Screen Transition Logic */}
        {!hasEntered ? (
          <LandingPage onEnter={() => setHasEntered(true)} />
        ) : (
          isMobile ? <MobileDashboard /> : <Dashboard />
        )}
      </div>


    </div>
  );
};

export default App;