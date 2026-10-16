import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import DpIntroVisualizer from "@/components/DpIntroVisualizer";

export const metadata = {
  title: "DP Intro — DSA Visualizer",
  description: "Memoization vs recomputation: watch fib(n) reuse saved answers.",
};

export default function DpIntroPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="dp-intro" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <DpIntroVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
