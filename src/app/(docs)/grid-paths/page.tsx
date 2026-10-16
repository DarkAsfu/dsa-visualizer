import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import GridPathsVisualizer from "@/components/GridPathsVisualizer";

export const metadata = {
  title: "Grid Paths — DSA Visualizer",
  description: "Unique paths counting: each cell is top plus left.",
};

export default function GridPathsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="grid-paths" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <GridPathsVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
