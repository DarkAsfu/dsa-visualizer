import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import MergeIntervalsVisualizer from "@/components/MergeIntervalsVisualizer";

export const metadata = {
  title: "Merge Intervals — DSA Visualizer",
  description: "Sort by start, sweep once: overlap extends, gap pushes.",
};

export default function MergeIntervalsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="merge-intervals" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <MergeIntervalsVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
