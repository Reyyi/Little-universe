import { site } from "@/data/site";

/** Cinematic loading state, used for route suspense and heavy dynamic imports. */
export function LoadingScreen({ label = site.loading }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-ink-950">
      <span aria-hidden className="size-1.5 animate-breathe rounded-full bg-gold shadow-[0_0_24px_6px_rgba(200,173,125,0.35)]" />
      <p className="font-display text-xl italic text-mist sm:text-2xl">{label}</p>
      <div aria-hidden className="relative h-px w-40 overflow-hidden bg-paper/10">
        <span className="absolute inset-y-0 left-0 w-1/3 animate-loading bg-gradient-to-r from-transparent via-gold to-transparent" />
      </div>
    </div>
  );
}
