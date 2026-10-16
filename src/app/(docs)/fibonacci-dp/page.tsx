import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FibonacciVisualizer from "@/components/FibonacciVisualizer";

export const metadata = {
  title: "Fibonacci DP — DSA Visualizer",
  description: "Naive recursion vs bottom-up table: linear beats exponential.",
};

export default function FibonacciPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="fibonacci-dp" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <FibonacciVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
