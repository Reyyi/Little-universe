import { memo } from "react";

const DUST = Array.from({ length: 46 }, (_, i) => {
  const r = (n: number) => ((Math.sin(i * 928.37 + n * 41.3) + 1) / 2) % 1;
  const f = (v: number) => Math.round(v * 100) / 100;
  return { x: f(r(1) * 100), y: f(r(2) * 100), s: f(1 + r(3) * 1.6), d: f(r(4) * 6) };
});

/** Fixed night-sky atmosphere behind every page. Pure CSS, no JS work per frame. */
export const AmbientBackground = memo(function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,#19151d_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_85%_100%,rgba(200,173,125,0.06)_0%,transparent_70%)]" />
      {DUST.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-paper animate-twinkle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.s,
            height: p.s,
            animationDelay: `${p.d}s`,
            animationDuration: `${(4 + p.d).toFixed(2)}s`,
            opacity: 0.4,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
});
