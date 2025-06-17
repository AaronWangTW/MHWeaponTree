'use client';
import React, { useState } from 'react';
import { readInfo } from '../lib/infoReader';
import WeaponTree from './weapon-tree/weaponTree';
import WeaponTypeSwitch from './weapon-tree/WeaponTypeSwitch';
import WeaponDetailPanel from './weapon-details/WeaponDetailPanel';
import CompareTray from './weapon-details/CompareTray';

const info = readInfo();

export default function WeaponTreePage() {
  const [weaponType, setWeaponType] = useState(0); // 0-13
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedWeapon, setSelectedWeapon] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showComparePanel, setShowComparePanel] = useState(false);

  const handleNodeClick = (_, node) => {
    setSelectedWeapon(node.data);
    setDetailOpen(true);
  };

  const addToCompare = (weapon) => {
    if (!compareList.find(w => w.label === weapon.label)) {
      setCompareList([...compareList, weapon]);
    }
  };

  const clearCompare = () => {
    setCompareList([]);
    setShowComparePanel(false);
  };

  return (
    <div className="relative w-screen h-screen">
      <WeaponTree nodeData={info.nodes[weaponType]} edgeData={info.edges[weaponType]} nodeClick={handleNodeClick} />
      <WeaponTypeSwitch onSelect={(value) => {
        setWeaponType(value);
        setCompareList([]);
        setSelectedWeapon(null);
        setShowComparePanel(false);
      }} selected={weaponType} />
      <WeaponDetailPanel
        isOpen={detailOpen}
        onClose={() => setDetailOpen(false)}
        weapon={selectedWeapon}
        onAddToCompare={addToCompare}
      />
      {compareList.length > 0 && (<CompareTray
        weapons={compareList}
        onCompare={() => setShowComparePanel(true)}
        onClear={clearCompare}
      />)}
    </div>
  );
}