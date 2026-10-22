"use client";
import { useEffect, useRef } from "react";

type Ripple = { x: number; y: number; t: number };

// Dot grid. Ripples spawn on click and now and then on their own.
export default function RippleGrid({ gridSize = 34, speed = 320, color = "255,255,255", className = "bg-canvas" }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const LIFE = 5000, BAND = 70;
    let w = 0, h = 0, raf = 0, last = 0;
    let ripples: Ripple[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (x: number, y: number) => { ripples.push({ x, y, t: performance.now() }); };
    const onDown = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      if (e.clientY >= r.top && e.clientY <= r.bottom) spawn(e.clientX - r.left, e.clientY - r.top);
    };

    const draw = (now: number) => {
      if (now - last > 3500) { spawn(Math.random() * w, Math.random() * h); last = now; }
      ripples = ripples.filter((r) => now - r.t < LIFE);
      ctx.clearRect(0, 0, w, h);
      for (let x = gridSize / 2; x < w; x += gridSize) {
        for (let y = gridSize / 2; y < h; y += gridSize) {
          let a = 0.12, s = 1;
          for (const r of ripples) {
            const age = now - r.t;
            const delta = Math.hypot(x - r.x, y - r.y) - (age / 1000) * speed;
            if (Math.abs(delta) < BAND) {
              const k = (1 - Math.abs(delta) / BAND) * (1 - age / LIFE);
              a += k * 0.8; s += k * 2.2;
            }
          }
          ctx.fillStyle = `rgba(${color},${Math.min(a, 1)})`;
          ctx.beginPath(); ctx.arc(x, y, s, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (!still) raf = requestAnimationFrame(draw);
    };

    resize();
    spawn(w / 2, h / 2);
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointerdown", onDown);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointerdown", onDown); };
  }, [gridSize, speed, color]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
