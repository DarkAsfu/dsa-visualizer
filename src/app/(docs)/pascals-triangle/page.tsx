import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import PascalVisualizer from "@/components/PascalVisualizer";

export const metadata = {
  title: "Pascal's Triangle — DSA Visualizer",
  description: "Each cell sums its two parents: combinations built live.",
};

export default function PascalsTrianglePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="pascals-triangle" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <PascalVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
