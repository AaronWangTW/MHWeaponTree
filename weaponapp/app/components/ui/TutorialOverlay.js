// components/TutorialOverlay.js
'use client';
import { useAppState } from '@/app/lib/AppStateProvider';
import { X, HelpCircle } from 'lucide-react';

export default function TutorialOverlay() {
  const { showTutorial, dismissTutorial, restartTutorial } = useAppState();

  return (
    <>
      <button
        className="fixed top-4 right-4 z-40 bg-gray-700 text-white px-3 py-2 text-sm rounded hover:bg-green-600 flex items-center gap-1"
        onClick={restartTutorial}
      >
        <HelpCircle size={16} /> Tutorial
      </button>

      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-75 flex flex-col items-center justify-center p-6 text-white">
          <div className="bg-[#2a2a2a] p-6 rounded-xl max-w-md space-y-4">
            <h2 className="text-xl font-bold">Welcome to Monster Hunter World Weapon Trees!</h2>
            <p>1. Click on a weapon to view its details.</p>
            <p>2. Switch weapon types with the bar on the top left.</p>
            <p>2. Add weapons to your compare list from the detail panel.</p>
            <p>3. Use the Compare button to open the compare panel and compare two weapons from your compare list at a time.</p>
            <button
              onClick={dismissTutorial}
              className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-sm"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </>
  );
}