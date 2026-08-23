"use client";

import { useEffect, useRef, useState } from "react";

/* ---- CountUp: animates a number when scrolled into view ---- */
export function CountUp({
  value,
  suffix = "",
  prefix = "",
  duration = 1100,
  className,
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!seen) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(eased * value);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

/* ---- RevealSection: fades + slides children in on scroll ---- */
export function Reveal({
  children,
  className = "",
  as: As = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Comp = As as any;
  return (
    <Comp ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`}>
      {children}
    </Comp>
  );
}

/* ---- SectionHeading: consistent phase eyebrow + title ---- */
export function PhaseEyebrow({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="inline-flex items-center gap-2 chip-accent px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.18em] mb-4">
      {icon}
      {children}
    </div>
  );
}

/* ---- StatBar: labeled animated progress bar ---- */
export function StatBar({
  label,
  value,
  color,
  suffix = "%",
}: {
  label: string;
  value: number;
  color: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setW(Math.min(value, 100));
          obs.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-semibold text-[rgb(var(--text))]">{label}</span>
        <span className="text-xs font-black tabnum" style={{ color }}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="progress-track h-2">
        <div
          className="h-full progress-bar-fill rounded-full"
          style={{ width: `${w}%`, backgroundColor: color, boxShadow: `0 0 10px ${color}80` }}
        />
      </div>
    </div>
  );
}
