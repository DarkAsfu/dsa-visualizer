import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SortingVisualizer from "@/components/SortingVisualizer";

export const metadata = {
  title: "Quick Sort — DSA Visualizer",
  description: "Partition around a pivot, recurse both sides.",
};

export default function QuickSortPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="quick-sort" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SortingVisualizer initialAlgo="quick" />
        </Suspense>
      </div>
    </main>
  );
}
