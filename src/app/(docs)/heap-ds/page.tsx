import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import HeapVisualizer from "@/components/HeapVisualizer";

export const metadata = {
  title: "Heap — DSA Visualizer",
  description: "Max-heap build, insert and extract-max.",
};

export default function HeapPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="heap-ds" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <HeapVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
