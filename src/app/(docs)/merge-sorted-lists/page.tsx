import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import MergeVisualizer from "@/components/MergeVisualizer";

export const metadata = {
  title: "Merge Two Sorted Lists — DSA Visualizer",
  description: "Take the smaller head, drain the rest.",
};

export default function MergeSortedListsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="merge-sorted-lists" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <MergeVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
