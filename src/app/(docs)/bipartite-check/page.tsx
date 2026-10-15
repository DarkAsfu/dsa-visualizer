import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import BipartiteVisualizer from "@/components/BipartiteVisualizer";

export const metadata = {
  title: "Bipartite Check — DSA Visualizer",
  description: "Two-color the graph — one conflict fails it.",
};

export default function BipartitePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bipartite-check" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <BipartiteVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
