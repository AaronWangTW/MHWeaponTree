// app/page.js
'use client';

import {
  ReactFlow,
  ReactFlowProvider,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { readInfo } from './lib/infoReader';
import Dagre from '@dagrejs/dagre';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { WeaponNode } from './components/weapon-tree/weaponNode';

const info = readInfo();
const all_nodes = info.nodes
const all_edges = info.edges

const getLayoutedElements = (nodes, edges) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR' });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

const LayoutFlow = () => {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(all_nodes[5]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(all_edges[5]);
  const customTypes = useMemo(() => {
    const types = { weapon: WeaponNode };
    return types;
  }, []);
  const layoutDone = useRef(false);

  useEffect(() => {
    if (!layoutDone.current) {
      const hasMeasured = nodes.every((node) => node.measured);
      if (hasMeasured) {
        const layouted = getLayoutedElements(nodes, edges);
        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
        fitView();
        layoutDone.current = true;
      }
    }
  }, [nodes, edges, fitView]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={customTypes}
      fitView
    >
    </ReactFlow>
  );
};

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlowProvider>
        <LayoutFlow />
      </ReactFlowProvider>
    </div>
  );
}