
// WeaponNode.js - Updated custom node
'use client';

import styles from './WeaponNode.module.css'

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const SHARPNESS_COLORS = {
  red: '#ff0000',
  orange: '#ff7f00',
  yellow: '#ffff00',
  green: '#00ff00',
  blue: '#0000ff',
  white: '#ffffff',
  purple: '#800080',
};

const WeaponNode = ({ data }) => {
  const sharpness = data.sharpness?.base || {};
  const sharpnessTotal = Object.values(sharpness).reduce((acc, v) => acc + v, 0.001); // avoid division by zero

  return (
    <div className={styles.node}>
      <div className={styles.label}>{data.label}</div>

      <div className={styles.stats}>
        <div><strong>Attack:</strong> {data.attack}</div>
        <div><strong>Affinity:</strong> {data.affinity}</div>
        <div><strong>Element:</strong> {data.element}</div>
      </div>

      <div className={styles.sharpnessBar}>
        {Object.entries(sharpness).map(([color, value]) => (
          <div
            key={color}
            style={{
              width: `${(value / sharpnessTotal) * 100}%`,
              background: SHARPNESS_COLORS[color]
            }}
          />
        ))}
      </div>

      <Handle 
        type="target" 
        position={Position.Left} 
        style={{ background: '#555' }}
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        style={{ background: '#555' }}
      />
    </div>
  );
};

export { WeaponNode };