"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

type Props = {
  text: string;
  as?: React.ElementType;
  duration?: number;
  className?: string;
  replayOnHover?: boolean;
};

// Characters scramble, then settle left to right.
export default function ShuffleText({ text, as: Tag = "span", duration = 900, className, replayOnHover = true }: Props) {
  const [out, setOut] = useState(text);
  const raf = useRef(0);
  const el = useRef<HTMLElement>(null);

  const run = useCallback(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setOut(
        text.split("").map((ch, i) => {
          if (ch === " ") return ch;
          const settleAt = 0.25 + (i / text.length) * 0.75;
          return t >= settleAt ? ch : CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join("")
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(node);
    return () => { io.disconnect(); cancelAnimationFrame(raf.current); };
  }, [run]);

  return (
    <Tag ref={el} className={className} aria-label={text} onMouseEnter={replayOnHover ? run : undefined}>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
