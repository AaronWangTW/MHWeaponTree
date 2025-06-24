'use client';
import { useEffect } from 'react';
import { useAppState } from '@/app/lib/AppStateProvider';

export default function TitleScreen() {
  const { showTitleScreen, dismissTitle } = useAppState();

  useEffect(() => {
    if (!showTitleScreen) return;

    const handleDismiss = () => {
      dismissTitle();
      window.removeEventListener('click', handleDismiss);
      window.removeEventListener('keydown', handleDismiss);
    };

    window.addEventListener('click', handleDismiss);
    window.addEventListener('keydown', handleDismiss);

    return () => {
      window.removeEventListener('click', handleDismiss);
      window.removeEventListener('keydown', handleDismiss);
    };
  }, [showTitleScreen, dismissTitle]);

  if (!showTitleScreen) return null;

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-100">
      <h1 className="text-6xl text-white font-bold tracking-widest text-center">
        Monster Hunter World Weapon Trees<br />
        <span className="text-base block mt-4 text-white">Interactive displayer of all weapons in the game with stats and comparison</span>
        <span className="text-xs block mt-4 text-gray-400 p-5">Made with love by <a className='text-lime-400' href='https://github.com/AaronWangTW' target='_blank'>AaronWangTW</a></span>
        <span className="text-sm block mt-4 text-gray-400">Click anywhere to continue</span>

      </h1>
      
    </div>
  );
}
