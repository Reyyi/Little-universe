"use client";

import { Button } from "@/components/ui/button";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <section role="alert" className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="eyebrow">Something drifted out of orbit</p>
      <h1 className="display max-w-2xl text-balance text-4xl italic sm:text-6xl">This moment didn&apos;t load the way it should have.</h1>
      <p className="max-w-sm text-mist">Your progress is safe. Let&apos;s try that again.</p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
