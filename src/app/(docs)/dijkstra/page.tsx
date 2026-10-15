import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import DijkstraVisualizer from "@/components/DijkstraVisualizer";

export const metadata = {
  title: "Dijkstra — DSA Visualizer",
  description: "Shortest paths from one source, greedy and optimal.",
};

export default function DijkstraPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="dijkstra" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <DijkstraVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
