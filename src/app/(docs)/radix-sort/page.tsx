import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SortingVisualizer from "@/components/SortingVisualizer";

export const metadata = {
  title: "Radix Sort — DSA Visualizer",
  description: "Stable digit passes, LSD first.",
};

export default function RadixSortPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="radix-sort" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SortingVisualizer initialAlgo="radix" />
        </Suspense>
      </div>
    </main>
  );
}
