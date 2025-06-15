
// WeaponNode.js - Updated custom node
'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';

const WeaponNode = ({ data }) => {
  return (
    <div 
      className="custom-node"
      style={{
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        background: '#fff',
        minWidth: '120px',
        textAlign: 'center'
      }}
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