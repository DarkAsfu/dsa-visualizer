import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SegVisualizer from "@/components/SegVisualizer";

export const metadata = {
  title: "Segment Tree — DSA Visualizer",
  description: "Range sum queries: take inside, skip outside.",
};

export default function SegPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="segment-tree" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SegVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
