"use client";

import { X } from 'lucide-react';
import { useMemo, useState } from 'react';

const SHARPNESS_PRIORITY = [
  'purple', 'white', 'blue', 'green', 'yellow', 'orange', 'red'
];

function parseElementValue(elementStr) {
  const match = elementStr?.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function getHighestSharpnessColor(sharpness) {
  for (const color of SHARPNESS_PRIORITY) {
    if (sharpness?.[color] > 0) return color;
  }
  return null;
}

function compareSharpness(s1, s2) {
  const c1 = getHighestSharpnessColor(s1);
  const c2 = getHighestSharpnessColor(s2);
  const i1 = SHARPNESS_PRIORITY.indexOf(c1);
  const i2 = SHARPNESS_PRIORITY.indexOf(c2);
  if (i1 !== i2) return i1 < i2 ? 1 : -1;
  return s1[c1] > s2[c2] ? 1 : (s1[c1] < s2[c2] ? -1 : 0);
}

function compareSlots(s1 = [], s2 = []) {
  const max1 = s1.map((count, i) => count > 0 ? i + 1 : 0).reduce((a, b) => Math.max(a, b), 0);
  const max2 = s2.map((count, i) => count > 0 ? i + 1 : 0).reduce((a, b) => Math.max(a, b), 0);

  if (max1 !== max2) return max1 > max2 ? 'left' : 'right';

  const max1Count = s1[max1 - 1] || 0;
  const max2Count = s2[max2 - 1] || 0;

  return max1Count > max2Count ? 'left' : (max1Count < max2Count ? 'right' : 'equal');
}

export default function ComparePanel({ open, onClose, selectedWeapons }) {
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(1);

  const left = selectedWeapons[leftIndex];
  const right = selectedWeapons[rightIndex];

  const comparisons = useMemo(() => {
    if (!left || !right) return {};
    return {
      attack: parseInt(left.attack) > parseInt(right.attack) ? 'left' : (parseInt(left.attack) < parseInt(right.attack) ? 'right' : 'equal'),
      affinity: parseInt(left.affinity) > parseInt(right.affinity) ? 'left' : (parseInt(left.affinity) < parseInt(right.affinity) ? 'right' : 'equal'),
      element: parseElementValue(left.element) > parseElementValue(right.element) ? 'left' : (parseElementValue(left.element) < parseElementValue(right.element) ? 'right' : 'equal'),
      sharpnessBase: compareSharpness(left.sharpness?.base, right.sharpness?.base) === 1 ? 'left' : (compareSharpness(left.sharpness?.base, right.sharpness?.base) === -1 ? 'right' : 'equal'),
      sharpnessMax: compareSharpness(left.sharpness?.max, right.sharpness?.max) === 1 ? 'left' : (compareSharpness(left.sharpness?.max, right.sharpness?.max) === -1 ? 'right' : 'equal'),
      slots: compareSlots(left.slots, right.slots)
    };
  }, [left, right]);

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
          relative w-[90%] h-[calc(100%-2rem)] bg-[#1e1e1e]
          rounded-xl p-6 mb-4 overflow-y-auto shadow-2xl
          border border-green-600 pointer-events-auto flex flex-col
        "
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-300 hover:text-red-400"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold text-white mb-6 text-center">Compare Weapons</h2>

        <div className="flex justify-center gap-4 mb-6">
          {selectedWeapons.map((w, idx) => (
            <button
              key={idx}
              className={`px-2 py-1 text-xs rounded ${idx === leftIndex ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setLeftIndex(idx)}
            >{w.label}</button>
          ))}
          <span className="text-white">vs</span>
          {selectedWeapons.map((w, idx) => (
            <button
              key={idx}
              className={`px-2 py-1 text-xs rounded ${idx === rightIndex ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              onClick={() => setRightIndex(idx)}
            >{w.label}</button>
          ))}
        </div>

        <table className="w-full text-white text-sm table-fixed border-separate border-spacing-x-4 border-spacing-y-3">
          <thead>
            <tr>
              <th className="w-1/3 text-left">{left?.label}</th>
              <th className="w-1/3 text-center"></th>
              <th className="w-1/3 text-right">{right?.label}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span className="text-gray-400 mr-2">{left?.rarity}</span></td>
              <td className="text-center"></td>
              <td className="text-right"><span className="text-gray-400 ml-2">{right?.rarity}</span></td>
            </tr>
            <tr>
              <td><span className="text-gray-400 mr-2">Attack:</span>{left?.attack}</td>
              <td className="text-center">{comparisons.attack === 'left' ? '←' : comparisons.attack === 'right' ? '→' : '='}</td>
              <td className="text-right">{right?.attack}<span className="text-gray-400 ml-2">:Attack</span></td>
            </tr>
            <tr>
              <td><span className="text-gray-400 mr-2">Affinity:</span>{left?.affinity}</td>
              <td className="text-center">{comparisons.affinity === 'left' ? '←' : comparisons.affinity === 'right' ? '→' : '='}</td>
              <td className="text-right">{right?.affinity}<span className="text-gray-400 ml-2">:Affinity</span></td>
            </tr>
            <tr>
              <td><span className="text-gray-400 mr-2">Element:</span>{left?.element}</td>
              <td className="text-center">{comparisons.element === 'left' ? '←' : comparisons.element === 'right' ? '→' : '='}</td>
              <td className="text-right">{right?.element}<span className="text-gray-400 ml-2">:Element</span></td>
            </tr>
            <tr>
              <td className="align-top">
                <div className="text-xs text-gray-400 mb-1">Base Sharpness</div>
                <SharpnessBar sharpness={left?.sharpness?.base} />
              </td>
              <td className="text-center align-middle">{comparisons.sharpnessBase === 'left' ? '←' : comparisons.sharpnessBase === 'right' ? '→' : '='}</td>
              <td className="text-right align-top">
                <div className="text-xs text-gray-400 mb-1">Base Sharpness</div>
                <SharpnessBar sharpness={right?.sharpness?.base} />
              </td>
            </tr>
            <tr>
              <td className="align-top">
                <div className="text-xs text-gray-400 mb-1">Max Sharpness</div>
                <SharpnessBar sharpness={left?.sharpness?.max} />
              </td>
              <td className="text-center align-middle">{comparisons.sharpnessMax === 'left' ? '←' : comparisons.sharpnessMax === 'right' ? '→' : '='}</td>
              <td className="text-right align-top">
                <div className="text-xs text-gray-400 mb-1">Max Sharpness</div>
                <SharpnessBar sharpness={right?.sharpness?.max} />
              </td>
            </tr>
            <tr>
  <td className="align-top">
    <div className="text-xs text-gray-400 mb-1">Slots</div>
    <SlotDisplay slots={left?.slots} />
  </td>
  <td className="text-center align-middle">
    {comparisons.slots === 'left' ? '←' : comparisons.slots === 'right' ? '→' : '='}
  </td>
  <td className="text-right align-top">
    <div className="text-xs text-gray-400 mb-1">Slots</div>
    <SlotDisplay slots={right?.slots} align="right" />
  </td>
</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SharpnessBar({ sharpness }) {
  if (!sharpness) return null;
  const SHARPNESS_COLORS = {
    red: '#9e2c24', orange: '#bf6730', yellow: '#dec03c',
    green: '#91cf36', blue: '#2e52bf', white: '#e6e6e6', purple: '#751fad'
  };

  return (
    <div className="flex h-2 overflow-hidden rounded w-full bg-neutral-800">
      {Object.entries(sharpness).map(([color, width]) => (
        width > 0 && (
          <div
            key={color}
            style={{ width: `${width * 2}px`, background: SHARPNESS_COLORS[color] }}
          />
        )
      ))}
    </div>
  );
}

function SlotDisplay({ slots = [], align = 'left' }) {
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'} gap-1`}>
      {slots.flatMap((count, i) =>
        Array.from({ length: count }, (_, idx) => (
          <img
            key={`slot-${i + 1}-${idx}`}
            src={`/slot_icons/slot${i + 1}.png`}
            alt={`Slot Level ${i + 1}`}
            className="w-5 h-5"
          />
        ))
      )}
    </div>
  );
}