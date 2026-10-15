import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SearchVisualizer from "@/components/SearchVisualizer";

export const metadata = {
  title: "Linear Search — DSA Visualizer",
  description: "Scan one by one: linear search stepped through with comparisons.",
};

export default function LinearSearchPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="linear-search" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SearchVisualizer initialAlgo="linear" />
        </Suspense>
      </div>
    </main>
  );
}
