'use client';

import React from 'react';
import WeaponTreePage from './components/WeaponTreePage';

import TitleScreen from './components/ui/TitleScreen';
import TutorialOverlay from './components/ui/TutorialOverlay';
import { useAppState } from './lib/AppStateProvider';

export default function Home() {
  const { showTitleScreen } = useAppState();
  return (
    <div className="w-screen h-screen">
      {showTitleScreen ? (
        <TitleScreen />
      ) : (
        <>
        <WeaponTreePage></WeaponTreePage>
        <TutorialOverlay></TutorialOverlay>
        </>
      )}
    </div>
  );
}