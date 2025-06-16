import { BaseEdge, step } from '@xyflow/react';
 
export default function WeaponEdge({ id, sourceX, sourceY, targetX, targetY }) {
  const centerX = (targetX - sourceX) / 2 + sourceX;
 
  const edgePath = `M ${sourceX} ${sourceY} L ${centerX} ${sourceY} L ${centerX} ${targetY} L ${targetX} ${targetY}`;
 
    return (
      <path
        id={id}
        d={edgePath}
        stroke="#e6e6e6"
        strokeWidth={5}
        fill="none"
      />
  );
}