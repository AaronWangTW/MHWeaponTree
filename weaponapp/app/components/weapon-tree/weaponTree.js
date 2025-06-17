'use client';

import styles from './weaponTree.module.css'

import {
    ReactFlow,
    ReactFlowProvider,
    useNodesState,
    useEdgesState,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import Dagre from '@dagrejs/dagre';
import React, { useState,useEffect, useMemo, useRef } from 'react';
import { WeaponNode } from './weaponNode';
import WeaponEdge from './WeaponEdge';

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

const LayoutFlow = ({ nodeData, edgeData,nodeClick }) => {
    const { fitView } = useReactFlow();
    const customTypes = useMemo(() => {
        const types = { weapon: WeaponNode };
        return types;
    }, []);
    const customEdges = useMemo(() => {
        const types = { 'WeaponEdge': WeaponEdge };
        return types;
    }, []);
    const layoutDone = useRef(false);
    const [loading, setLoading] = useState(false);
    const [nodes, setNodes, onNodesChange] = useNodesState(nodeData);
    const [edges, setEdges, onEdgesChange] = useEdgesState(edgeData);
    useEffect(() => {
        layoutDone.current = false; // Reset layout flag on new data
        setNodes(nodeData);
        setEdges(edgeData);
        setLoading(true);
    }, [nodeData, edgeData]);

    useEffect(() => {
        if (!layoutDone.current) {
            const hasMeasured = nodes.every((node) => node.measured);
            setTimeout(() => {
                if (hasMeasured) {
                const layouted = getLayoutedElements(nodes, edges);
                setNodes([...layouted.nodes]);
                setEdges([...layouted.edges]);
                fitView();
                layoutDone.current = true;
                setLoading(false);
            }
            }, 50);
        }
    }, [nodes, edges, setNodes, setEdges, fitView]);

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={customTypes}
            edgeTypes={customEdges}
            fitView
            onNodeClick={nodeClick}
            nodesDraggable={false}
            nodesConnectable={false}
            edgesFocusable={false}
        >{loading && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: '#333',
                    zIndex: 10,
                    userSelect: 'none',
                }}>
                    Loading...
                </div>
            )}
        </ReactFlow>
        
    );
};

export default function WeaponTree({ nodeData, edgeData, nodeClick}) {
    return (
        <div style={{ width: '100vw', height: '100vh'}} className={styles.page}>
            <ReactFlowProvider>
                <LayoutFlow nodeData={nodeData} edgeData={edgeData} nodeClick={nodeClick} className="cursor-none"/>
            </ReactFlowProvider>
        </div>
    );
}