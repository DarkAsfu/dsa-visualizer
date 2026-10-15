import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SearchVisualizer from "@/components/SearchVisualizer";

export const metadata = {
  title: "Interpolation Search — DSA Visualizer",
  description: "Probe where the value should be: interpolation search visualized.",
};

export default function InterpolationSearchPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="interpolation-search" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SearchVisualizer initialAlgo="interpolation" />
        </Suspense>
      </div>
    </main>
  );
}
