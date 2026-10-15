import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ArrayOpsVisualizer from "@/components/ArrayOpsVisualizer";

export const metadata = {
  title: "Array Operations — DSA Visualizer",
  description: "Insert, delete, rotate and reverse on a live array, shift by shift.",
};

export default function ArrayOpsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="array-ops" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <ArrayOpsVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
