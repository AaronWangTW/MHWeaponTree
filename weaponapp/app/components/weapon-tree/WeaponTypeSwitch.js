'use client';

import Image from 'next/image';

export default function WeaponTypeSwitch({ onSelect, selected }) {
  return (
    <div className="absolute top-4 left-4 z-50 p-2 rounded shadow" style={{
      background:'#828282'
    }}>
      {[...Array(14)].map((_, i) => (
        <button
          key={i}
          className={`m-1 p-1 w-9 h-9 rounded ${selected === i ? 'bg-gray-500 text-white' : 'bg-gray-700'} hover:bg-gray-500`}
          onClick={() => onSelect(i)}
        >
          <Image
            unoptimized 
            src={`/MHWeaponTree/weapon_icons/weapon_type_${i}.png`}
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