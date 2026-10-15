import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import GraphVisualizer from "@/components/GraphVisualizer";

export const metadata = {
  title: "DFS — DSA Visualizer",
  description: "Dive deep with a stack, backtrack when stuck.",
};

export default function DFSPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="dfs" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <GraphVisualizer initialAlgo="dfs" />
        </Suspense>
      </div>
    </main>
  );
}
