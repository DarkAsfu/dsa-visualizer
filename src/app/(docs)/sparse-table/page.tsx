import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SparseVisualizer from "@/components/SparseVisualizer";

export const metadata = {
  title: "Sparse Table — DSA Visualizer",
  description: "Precompute power-of-two minimums, answer RMQ with two blocks.",
};

export default function SparseTablePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="sparse-table" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SparseVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
