'use client';

import { Background } from '@xyflow/react';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handlePointerMove = (e) => {
            setPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('pointermove', handlePointerMove);
        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, []);

    return (
        <div
            className="pointer-events-none fixed top-0 left-0 z-[9999]"
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`,
                transition: 'transform 0.01s linear',
            }}
        >
            <div className="relative w-6 h-6" >
                {/* Center dot */}
                <div style={{ background: '#a3ff5e' }} className="absolute top-1/2 left-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-[0_0_6px_2px_rgba(163,255,94,0.6)]" />

                {/* Arc 1: Top-right */}
                <div className="absolute top-0 right-0 w-6 h-6 animate-spin-slow">
                    <svg width="24" height="24" className="block">
                        {/* Smaller radius arc */}
                        <path
                            d="M12 5 A7 7 0 0 1 19 12"
                            stroke="#a3ff5e"
                            strokeWidth="1"
                            fill="none"
                        />
                    </svg>
                </div>

                {/* Arc 2: Bottom-left, rotated 180° */}
                <div className="absolute bottom-0 left-0 w-6 h-6 animate-spin-slow-reverse">
                    <svg width="24" height="24" className="rotate-180 block">
                        <path
                            d="M12 5 A7 7 0 0 1 19 12"
                            stroke="#a3ff5e"
                            strokeWidth="1"
                            fill="none"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}