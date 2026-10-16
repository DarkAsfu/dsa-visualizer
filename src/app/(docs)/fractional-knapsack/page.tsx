import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FracKnapsackVisualizer from "@/components/FracKnapsackVisualizer";

export const metadata = {
  title: "Fractional Knapsack — DSA Visualizer",
  description: "Value density greedy: take whole items, then a fraction.",
};

export default function FractionalKnapsackPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="fractional-knapsack" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <FracKnapsackVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
