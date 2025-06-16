
// WeaponNode.js - Updated custom node
'use client';

import styles from './WeaponNode.module.css'

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const WeaponNode = ({ data }) => {
  return (
    <div 
      className={styles.node}
    >
      <div>{data.label}</div>
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