import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SearchVisualizer from "@/components/SearchVisualizer";

export const metadata = {
  title: "Ternary Search — DSA Visualizer",
  description: "Split into thirds with two mids: ternary search visualized.",
};

export default function TernarySearchPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="ternary-search" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SearchVisualizer initialAlgo="ternary" />
        </Suspense>
      </div>
    </main>
  );
}
