import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import AstarVisualizer from "@/components/AstarVisualizer";

export const metadata = {
  title: "A* Search — DSA Visualizer",
  description: "Guided shortest path with f = g + h.",
};

export default function AstarPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="astar" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <AstarVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
