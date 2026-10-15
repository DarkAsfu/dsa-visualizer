import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SearchVisualizer from "@/components/SearchVisualizer";

export const metadata = {
  title: "Exponential Search — DSA Visualizer",
  description: "Double the bound, then binary search inside: exponential search visualized.",
};

export default function ExponentialSearchPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="exponential-search" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SearchVisualizer initialAlgo="exponential" />
        </Suspense>
      </div>
    </main>
  );
}
