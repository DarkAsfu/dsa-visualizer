import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import DutchFlagVisualizer from "@/components/DutchFlagVisualizer";

export const metadata = {
  title: "Dutch Flag — DSA Visualizer",
  description: "Sort 0s, 1s and 2s in one pass with three pointers.",
};

export default function DutchFlagPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="dutch-flag" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <DutchFlagVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
