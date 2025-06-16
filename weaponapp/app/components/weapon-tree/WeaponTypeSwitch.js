'use client';

import Image from 'next/image';

export default function WeaponTypeSwitch({ onSelect, selected }) {
  return (
    <div className="absolute top-4 left-4 z-50 bg-white p-2 rounded shadow">
      {[...Array(14)].map((_, i) => (
        <button
          key={i}
          className={`m-1 p-1 w-6 h-6 rounded ${selected === i ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => onSelect(i)}
        >
          <Image
            src={`/weapon_icons/weapon_type_${i}.png`}
            alt={`Weapon Type ${i}`}
            width={32}
            height={32}
            priority={false} // can be true if you want these to preload
          />
        </button>
      ))}
    </div>
  );
}