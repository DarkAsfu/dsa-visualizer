import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import DiameterVisualizer from "@/components/DiameterVisualizer";

export const metadata = {
  title: "Tree Diameter & Views — DSA Visualizer",
  description: "Longest path via double BFS plus top, bottom, left and right views.",
};

export default function DiameterPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="tree-diameter" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <DiameterVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
