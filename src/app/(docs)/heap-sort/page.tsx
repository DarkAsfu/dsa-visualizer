import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SortingVisualizer from "@/components/SortingVisualizer";

export const metadata = {
  title: "Heap Sort — DSA Visualizer",
  description: "Max-heapify, then pluck the root home one by one.",
};

export default function HeapSortPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="heap-sort" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SortingVisualizer initialAlgo="heap" />
        </Suspense>
      </div>
    </main>
  );
}
