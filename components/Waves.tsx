"use client";
import { useEffect, useRef } from "react";

// Layered wave lines that bend away from the pointer.
export default function Waves({ lines = 26, color = "255,255,255", className = "bg-canvas" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const m = { x: -999, y: -999, tx: -999, ty: -999 };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      m.tx = e.clientX - r.left; m.ty = e.clientY - r.top;
    };

    const draw = (t: number) => {
      m.x += (m.tx - m.x) * 0.08; m.y += (m.ty - m.y) * 0.08;
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1;
      for (let i = 0; i < lines; i++) {
        const base = (h / (lines + 1)) * (i + 1);
        ctx.strokeStyle = `rgba(${color},${0.12 + (i / lines) * 0.28})`;
        ctx.beginPath();
        for (let x = 0; x <= w + 10; x += 10) {
          let y = base
            + Math.sin(x * 0.006 + t * 0.0006 + i * 0.35) * 18
            + Math.sin(x * 0.014 - t * 0.0009 + i * 0.2) * 8;
          const d2 = (x - m.x) ** 2 + (base - m.y) ** 2;
          y -= Math.exp(-d2 / 30000) * 40;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [lines, color]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
