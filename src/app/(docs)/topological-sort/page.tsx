import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import TopoVisualizer from "@/components/TopoVisualizer";

export const metadata = {
  title: "Topological Sort — DSA Visualizer",
  description: "Kahn's algorithm: zero-indegree first, erase and repeat.",
};

export default function TopologicalSortPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="topological-sort" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <TopoVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
