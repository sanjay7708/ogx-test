"use client";
import { useEffect, useRef, useState } from "react";

// Soundfonts: https://github.com/gleitz/midi-js-soundfonts (override with NEXT_PUBLIC_SOUNDFONT_URL)
const SOUNDFONT = process.env.NEXT_PUBLIC_SOUNDFONT_URL ?? "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/";
const NOTES = [60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83]; // C4 to B5
const NAMES = ["C", "D", "E", "F", "G", "A", "B"];

type Status = "loading" | "midi" | "fallback";

export default function Piano() {
  const [status, setStatus] = useState<Status>("loading");
  const [active, setActive] = useState<number | null>(null);
  const audio = useRef<AudioContext | null>(null);

  useEffect(() => {
    const w = window as any;
    let dead = false;
    const init = () =>
      w.MIDI.loadPlugin({
        soundfontUrl: SOUNDFONT,
        instrument: "acoustic_grand_piano",
        onsuccess: () => { if (!dead) { w.MIDI.programChange(0, 0); setStatus("midi"); } },
        onerror: () => !dead && setStatus("fallback"),
      });

    if (w.MIDI?.loadPlugin) init();
    else {
      const s = document.createElement("script");
      s.src = "/midi/MIDI.min.js"; // copy from the MIDI.js repo's build/ folder
      s.onload = init;
      s.onerror = () => !dead && setStatus("fallback");
      document.body.appendChild(s);
    }
    return () => { dead = true; };
  }, []);

  const play = (note: number) => {
    setActive(note);
    setTimeout(() => setActive(null), 160);
    const w = window as any;
    if (status === "midi") {
      w.MIDI.noteOn(0, note, 110, 0);
      w.MIDI.noteOff(0, note, 1.2);
      return;
    }
    audio.current ??= new AudioContext();
    const c = audio.current, o = c.createOscillator(), g = c.createGain();
    o.type = "triangle";
    o.frequency.value = 440 * 2 ** ((note - 69) / 12);
    g.gain.setValueAtTime(0.3, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.2);
    o.connect(g).connect(c.destination);
    o.start(); o.stop(c.currentTime + 1.2);
  };

  return (
    <div>
      <p className="piano-status" role="status">
        {status === "loading" && "Tuning up…"}
        {status === "midi" && "Piano ready."}
        {status === "fallback" && "MIDI.js not found, using a basic synth. See README."}
      </p>
      <div className="piano">
        {NOTES.map((n, i) => (
          <button key={n} className={active === n ? "on" : ""} onPointerDown={() => play(n)} aria-label={`Play ${NAMES[i % 7]}`}>
            {NAMES[i % 7]}
          </button>
        ))}
      </div>
    </div>
  );
}
