import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import KadaneVisualizer from "@/components/KadaneVisualizer";

export const metadata = {
  title: "Kadane's Algorithm — DSA Visualizer",
  description: "Maximum subarray in one pass: extend or restart, stepped through.",
};

export default function KadanePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="kadane" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <KadaneVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
