import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import BloomVisualizer from "@/components/BloomVisualizer";

export const metadata = {
  title: "Bloom Filter — DSA Visualizer",
  description: "Probabilistic membership with k hashes and no false negatives.",
};

export default function BloomPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bloom-filter" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <BloomVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
