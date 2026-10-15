import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import PrimVisualizer from "@/components/PrimVisualizer";

export const metadata = {
  title: "Prim's MST — DSA Visualizer",
  description: "Grow the cheapest tree one node at a time.",
};

export default function PrimsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="prims" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <PrimVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
