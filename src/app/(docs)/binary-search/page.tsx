import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SearchVisualizer from "@/components/SearchVisualizer";

export const metadata = {
  title: "Binary Search — DSA Visualizer",
  description: "Halve the sorted range every step: binary search visualized.",
};

export default function BinarySearchPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="binary-search" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SearchVisualizer initialAlgo="binary" />
        </Suspense>
      </div>
    </main>
  );
}
