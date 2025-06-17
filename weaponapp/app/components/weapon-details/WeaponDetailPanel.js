'use client';

import { X } from 'lucide-react';

export default function WeaponDetailPanel({ isOpen, onClose, weapon }) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-96 bg-[#1f1f1f] text-white shadow-lg transform transition-transform duration-300 z-50
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold">{weapon?.label || 'Weapon Details'}</h2>
        <button onClick={onClose} aria-label="Close">
          <X className="text-white hover:text-red-400" />
        </button>
      </div>

      {weapon ? (
        <div className="p-4 space-y-3 text-sm">
          <div><strong>Attack:</strong> {weapon.attack}</div>
          <div><strong>Affinity:</strong> {weapon.affinity}</div>
          <div><strong>Element:</strong> {weapon.element}</div>

          <div>
            <strong>Sharpness:</strong>
            <div className="mt-1">
              <div className="text-xs text-gray-400 mb-1">Base</div>
              <SharpnessBar sharpness={weapon.sharpness?.base} />
              <div className="text-xs text-gray-400 mt-2 mb-1">Max</div>
              <SharpnessBar sharpness={weapon.sharpness?.max} />
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 text-gray-400">Click a weapon to see details.</div>
      )}
    </div>
  );
}

// SharpnessBar subcomponent
function SharpnessBar({ sharpness }) {
  if (!sharpness) return null;

  const colors = {
    red: 'bg-red-600',
    orange: 'bg-orange-500',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    white: 'bg-white',
    purple: 'bg-purple-600',
  };

  return (
    <div className="flex h-2 overflow-hidden rounded w-full bg-neutral-800">
      {Object.entries(sharpness).map(([color, width]) => (
        width > 0 && (
          <div
            key={color}
            className={colors[color]}
            style={{ width: `${width * 2}px` }}
          />
        )
      ))}
    </div>
  );
}