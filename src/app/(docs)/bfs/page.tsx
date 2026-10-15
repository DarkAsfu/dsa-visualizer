import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import GraphVisualizer from "@/components/GraphVisualizer";

export const metadata = {
  title: "BFS — DSA Visualizer",
  description: "Flood the grid level by level with a queue.",
};

export default function BFSPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bfs" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <GraphVisualizer initialAlgo="bfs" />
        </Suspense>
      </div>
    </main>
  );
}
