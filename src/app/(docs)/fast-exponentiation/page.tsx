import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FastExpVisualizer from "@/components/FastExpVisualizer";

export const metadata = {
  title: "Fast Exponentiation — DSA Visualizer",
  description: "Binary method: square per bit, multiply on 1s — O(log n).",
};

export default function FastExponentiationPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="fast-exponentiation" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <FastExpVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
