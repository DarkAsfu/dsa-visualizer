import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FenwickVisualizer from "@/components/FenwickVisualizer";

export const metadata = {
  title: "Fenwick Tree — DSA Visualizer",
  description: "Binary indexed tree: point updates and prefix sums in O(log n).",
};

export default function FenwickPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="fenwick-tree" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <FenwickVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
