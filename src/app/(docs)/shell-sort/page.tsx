import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SortingVisualizer from "@/components/SortingVisualizer";

export const metadata = {
  title: "Shell Sort — DSA Visualizer",
  description: "Gapped insertion with a shrinking gap.",
};

export default function ShellSortPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="shell-sort" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SortingVisualizer initialAlgo="shell" />
        </Suspense>
      </div>
    </main>
  );
}
