import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import PrefixSumVisualizer from "@/components/PrefixSumVisualizer";

export const metadata = {
  title: "Prefix Sum — DSA Visualizer",
  description: "Build running totals once, answer any range sum in O(1).",
};

export default function PrefixSumPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="prefix-sum" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <PrefixSumVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
