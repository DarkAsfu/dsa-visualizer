import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FlowVisualizer from "@/components/FlowVisualizer";

export const metadata = {
  title: "Network Flow — DSA Visualizer",
  description: "Edmonds-Karp: augment shortest paths until the min cut shows.",
};

export default function FordFulkersonPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="ford-fulkerson" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <FlowVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
