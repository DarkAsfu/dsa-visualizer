import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SlidingWindowVisualizer from "@/components/SlidingWindowVisualizer";

export const metadata = {
  title: "Sliding Window — DSA Visualizer",
  description: "Fixed-k max sum and variable longest window, gliding step by step.",
};

export default function SlidingWindowPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="sliding-window" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SlidingWindowVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
