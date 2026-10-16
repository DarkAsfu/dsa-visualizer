import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ClosestPairVisualizer from "@/components/ClosestPairVisualizer";

export const metadata = {
  title: "Closest Pair — DSA Visualizer",
  description: "Divide, conquer, strip-check: nearest points in O(n log n).",
};

export default function ClosestPairPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="closest-pair" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <ClosestPairVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
