'use client';
import React, { useState } from 'react';
import { readInfo } from '../lib/infoReader';
import WeaponTree from './weapon-tree/weaponTree';
import WeaponTypeSwitch from './weapon-tree/WeaponTypeSwitch';
import WeaponDetailPanel from './weapon-details/WeaponDetailPanel';

const info = readInfo();

export default function WeaponTreePage() {
  const [weaponType, setWeaponType] = useState(0); // 0-13
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const handleNodeClick = (_, node) => {
    setSelectedWeapon(node.data);
    setDetailOpen(true);
  };

  return (
    <div className="relative w-screen h-screen">
      <WeaponTree nodeData={info.nodes[weaponType]} edgeData={info.edges[weaponType]} nodeClick={handleNodeClick} />
      <WeaponTypeSwitch onSelect={setWeaponType} selected={weaponType} />
      <WeaponDetailPanel
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        weapon={selectedWeapon}
      />
    </div>
  );
}