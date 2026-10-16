import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import KnapsackVisualizer from "@/components/KnapsackVisualizer";

export const metadata = {
  title: "0/1 Knapsack — DSA Visualizer",
  description: "Pick or skip table: take the item or leave it, cell by cell.",
};

export default function KnapsackPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="knapsack" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <KnapsackVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
