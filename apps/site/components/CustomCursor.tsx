'use client';
import { useEffect, useRef } from 'react';

export function CustomCursor() {
  const curRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cur = curRef.current;
    const ring = ringRef.current;
    if (!cur || !ring) return;

    let rx = 0, ry = 0, cx = 0, cy = 0;
    
    const handleMouseMove = (e: MouseEvent) => {
      cx = e.clientX;
      cy = e.clientY;
      cur.style.left = cx + 'px';
      cur.style.top = cy + 'px';
    };

    document.addEventListener('mousemove', handleMouseMove);

    let animationFrameId: number;
    const loop = () => {
      rx += (cx - rx) * 0.1;
      ry += (cy - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={curRef}></div>
      <div id="cur-r" ref={ringRef}></div>
    </>
  );
}
