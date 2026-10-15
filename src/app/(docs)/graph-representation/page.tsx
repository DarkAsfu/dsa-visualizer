import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import GraphRepVisualizer from "@/components/GraphRepVisualizer";

export const metadata = {
  title: "Graph Representation — DSA Visualizer",
  description: "Adjacency matrix vs list, side by side.",
};

export default function GraphRepresentationPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="graph-representation" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <GraphRepVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
