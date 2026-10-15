import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FloydVisualizer from "@/components/FloydVisualizer";

export const metadata = {
  title: "Floyd-Warshall — DSA Visualizer",
  description: "All-pairs shortest paths, one k layer at a time.",
};

export default function FloydWarshallPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="floyd-warshall" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <FloydVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
