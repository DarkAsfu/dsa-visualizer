import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SortingVisualizer from "@/components/SortingVisualizer";

export const metadata = {
  title: "Bubble Sort — DSA Visualizer",
  description: "Adjacent swaps sink the largest home, pass by pass.",
};

export default function BubbleSortPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bubble-sort" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SortingVisualizer initialAlgo="bubble" />
        </Suspense>
      </div>
    </main>
  );
}
