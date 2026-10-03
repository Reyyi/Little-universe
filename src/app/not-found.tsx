import Link from "next/link";
import { site } from "@/data/site";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex min-h-svh flex-col items-center justify-center gap-8 px-6 text-center">
      <p className="eyebrow">404 — lost in space</p>
      <h1 className="display max-w-3xl text-balance text-4xl italic sm:text-6xl">{site.notFound}</h1>
      <Button asChild>
        <Link href="/universe">Find the way back</Link>
      </Button>
    </section>
  );
}
