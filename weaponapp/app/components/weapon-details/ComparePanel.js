'use client';

import { X } from 'lucide-react';

export default function ComparePanel({ open, onClose, weapons }) {
  return (
    <div
      className={`
        fixed inset-0 z-50 flex justify-center items-end
        transition-transform duration-500 ease-in-out
        ${open ? 'translate-y-0' : 'translate-y-full'}
        pointer-events-none
      `}
    >
      <div
        className="
          relative w-[90%] h-[calc(100%-4rem)] bg-[#1e1e1e]
          rounded-xl p-6 my-8 overflow-y-auto shadow-2xl
          border border-green-600 pointer-events-auto
        "
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-400"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-semibold text-white mb-4">Compare Weapons</h2>

        {/* Weapon Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {weapons.map((w, i) => (
            <div
              key={i}
              className="bg-zinc-800 p-4 rounded text-white border border-gray-600"
            >
              <div className="text-lg font-semibold mb-2">{w.label}</div>
              <div>Attack: {w.attack}</div>
              <div>Affinity: {w.affinity}</div>
              <div>Element: {w.element}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
