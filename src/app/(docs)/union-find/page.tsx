import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import UnionFindVisualizer from "@/components/UnionFindVisualizer";

export const metadata = {
  title: "Union-Find — DSA Visualizer",
  description: "Disjoint sets with union by rank and path compression.",
};

export default function UnionFindPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="union-find" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <UnionFindVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
