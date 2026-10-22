"use client";
import { useEffect, useState } from "react";

export default function Loader({ name }: { name: string }) {
  const [pct, setPct] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        if (p >= 100) { clearInterval(id); setTimeout(() => setDone(true), 300); return 100; }
        return p + 4;
      });
    }, 40);
    return () => clearInterval(id);
  }, []);

  return (
    <div className={`loader ${done ? "loader-done" : ""}`} aria-hidden={done}>
      <p className="loader-name">{name}</p>
      <p>Loading {pct}%</p>
    </div>
  );
}
