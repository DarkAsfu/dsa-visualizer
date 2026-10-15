import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SortingVisualizer from "@/components/SortingVisualizer";

export const metadata = {
  title: "Bucket Sort — DSA Visualizer",
  description: "Scatter into buckets, sort piles, gather in order.",
};

export default function BucketSortPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bucket-sort" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SortingVisualizer initialAlgo="bucket" />
        </Suspense>
      </div>
    </main>
  );
}
