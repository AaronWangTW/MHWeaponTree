'use client';

import { X } from 'lucide-react';

export default function WeaponDetailPanel({ isOpen, onClose, weapon, onAddToCompare }) {
  return (

    <div className={`fixed inset-0 z-50 pointer-events-none p-4 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div
        className={`
          h-full w-96 bg-[#1f1f1f] text-white shadow-lg rounded-4xl opacity-98 pointer-events-auto ml-auto`}
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
            {onAddToCompare && (
              <div className="p-4 border-t border-gray-700">
                <button
                  onClick={() => onAddToCompare(weapon)}
                  className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded w-full text-sm"
                >
                  Add to Compare List
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 text-gray-400">Click a weapon to see details.</div>
        )}
      </div>
    </div>
  );
}



// SharpnessBar subcomponent
function SharpnessBar({ sharpness }) {
  if (!sharpness) return null;
  const SHARPNESS_COLORS = {
    red: '#9e2c24',
    orange: '#bf6730',
    yellow: '#dec03c',
    green: '#91cf36',
    blue: '#2e52bf',
    white: '#e6e6e6',
    purple: '#751fad',
  };

  return (
    <div className="flex h-2 overflow-hidden rounded w-full bg-neutral-800">
      {Object.entries(sharpness).map(([color, width]) => (
        width > 0 && (
          <div
            key={color}
            style={{ width: `${width * 2}px`, background: `${SHARPNESS_COLORS[color]}` }}
          />
        )
      ))}
    </div>
  );
}