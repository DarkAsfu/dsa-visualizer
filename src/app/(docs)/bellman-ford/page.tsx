import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import BellmanFordVisualizer from "@/components/BellmanFordVisualizer";

export const metadata = {
  title: "Bellman-Ford — DSA Visualizer",
  description: "Relax every edge V−1 times, then hunt negative cycles.",
};

export default function BellmanFordPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bellman-ford" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <BellmanFordVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
