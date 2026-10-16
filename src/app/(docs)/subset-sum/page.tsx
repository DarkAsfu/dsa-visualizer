import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SubsetSumVisualizer from "@/components/SubsetSumVisualizer";

export const metadata = {
  title: "Subset Sum — DSA Visualizer",
  description: "Reachable sums table: take it or skip it, boolean DP.",
};

export default function SubsetSumPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="subset-sum" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SubsetSumVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
