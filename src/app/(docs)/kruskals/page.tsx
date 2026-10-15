import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import KruskalVisualizer from "@/components/KruskalVisualizer";

export const metadata = {
  title: "Kruskal's MST — DSA Visualizer",
  description: "Cheapest edges first, skip the ones that cycle.",
};

export default function KruskalsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="kruskals" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <KruskalVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
