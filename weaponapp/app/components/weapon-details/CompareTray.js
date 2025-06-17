'use client';

import { ScrollText, Trash2 } from 'lucide-react';

export default function CompareTray({ weapons, onCompare, onClear }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1e1e1e] border-t border-gray-700 z-30 px-4 py-2">
      <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
        {weapons.map((w, i) => (
          <div
            key={i}
            className="bg-zinc-800 text-white px-3 py-1 rounded shadow text-xs whitespace-nowrap relative"
          >
            {w.label}
          </div>
        ))}

        {weapons.length > 0 && (
          <>
            <button
              onClick={onCompare}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded text-xs flex items-center"
            >
              <ScrollText size={16} className="mr-1" /> Compare
            </button>

            <button
              onClick={onClear}
              className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
