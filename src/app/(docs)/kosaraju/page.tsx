import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import KosarajuVisualizer from "@/components/KosarajuVisualizer";

export const metadata = {
  title: "SCC — DSA Visualizer",
  description: "Kosaraju's two passes find every strongly connected component.",
};

export default function KosarajuPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="kosaraju" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <KosarajuVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
