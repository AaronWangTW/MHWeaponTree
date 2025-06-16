'use client';
import React, { useState } from 'react';
import { readInfo } from '../lib/infoReader';
import WeaponTree from './weapon-tree/weaponTree';
import WeaponTypeSwitch from './weapon-tree/WeaponTypeSwitch';

const info = readInfo();

export default function WeaponTreePage() {
  const [weaponType, setWeaponType] = useState(0); // 0-13

  return (
    <div className="relative w-screen h-screen">
      <WeaponTree nodeData={info.nodes[weaponType]} edgeData={info.edges[weaponType]} />
      <WeaponTypeSwitch onSelect={setWeaponType} selected={weaponType} />
    </div>
  );
}