"use client";

import { useEffect, useRef, useState } from "react";

interface RadialGaugeProps {
  value: number; // 0-100 (already normalized to percentage-ish)
  max?: number;
  label: string;
  sublabel?: string;
  color: string;
  size?: number;
  thickness?: number;
  suffix?: string;
}

/**
 * Animated SVG radial gauge. Sweeps from 0 to `value` when it scrolls
 * into view, with a glowing progress arc and a faint track.
 */
export default function RadialGauge({
  value,
  max = 100,
  label,
  sublabel,
  color,
  size = 150,
  thickness = 12,
  suffix = "%",
}: RadialGaugeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [seen, setSeen] = useState(false);

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(value / max, 1));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(eased * value));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value]);

  const offset = circumference * (1 - (seen ? pct : 0));

  return (
    <div ref={ref} className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          role="img"
          aria-label={`${label}: ${value}${suffix}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgb(var(--bg-2))"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={thickness}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)",
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black tabnum leading-none" style={{ color }}>
            {display}
            <span className="text-lg">{suffix}</span>
          </span>
        </div>
      </div>
      <div className="text-center mt-3">
        <div className="text-xs font-bold uppercase tracking-wider text-[rgb(var(--text))]">{label}</div>
        {sublabel && <div className="text-[10px] text-muted mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
}
