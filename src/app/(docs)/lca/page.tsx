import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import LCAVisualizer from "@/components/LCAVisualizer";

export const metadata = {
  title: "LCA — DSA Visualizer",
  description: "Lowest common ancestor via root-to-node paths.",
};

export default function LCAPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="lca" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <LCAVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
