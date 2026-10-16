import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SieveVisualizer from "@/components/SieveVisualizer";

export const metadata = {
  title: "Sieve of Eratosthenes — DSA Visualizer",
  description: "Strike multiples, keep primes: prime generation in O(n log log n).",
};

export default function SievePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="sieve" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SieveVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
