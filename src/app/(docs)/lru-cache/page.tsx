import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import LRUVisualizer from "@/components/LRUVisualizer";

export const metadata = {
  title: "LRU Cache — DSA Visualizer",
  description: "Get and put with eviction of the least recently used key.",
};

export default function LRUPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="lru-cache" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <LRUVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
