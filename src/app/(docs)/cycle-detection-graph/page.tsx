import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import CycleVisualizer from "@/components/CycleVisualizer";

export const metadata = {
  title: "Cycle Detection — DSA Visualizer",
  description: "Gray-to-gray back edge means a directed cycle.",
};

export default function CycleGraphPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="cycle-detection-graph" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <CycleVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
