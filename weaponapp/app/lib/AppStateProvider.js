'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const AppStateContext = createContext();

export function AppStateProvider({ children }) {
  const [showTitleScreen, setShowTitleScreen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    const firstVisit = !localStorage.getItem('visited');
    if (firstVisit) {
      setShowTitleScreen(true);
      setShowTutorial(true);
      localStorage.setItem('visited', 'true');
    }
  }, []);

  const dismissTitle = () => setShowTitleScreen(false);
  const dismissTutorial = () => setShowTutorial(false);
  const restartTutorial = () => setShowTutorial(true);

  return (
    <AppStateContext.Provider value={{
      showTitleScreen,
      showTutorial,
      dismissTitle,
      dismissTutorial,
      restartTutorial
    }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppStateContext);
}