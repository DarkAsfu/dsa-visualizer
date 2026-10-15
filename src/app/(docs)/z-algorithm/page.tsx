import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ZVisualizer from "@/components/ZVisualizer";

export const metadata = {
  title: "Z-Algorithm — DSA Visualizer",
  description: "Z-array with the [l, r] box: copy inside, extend at the edge.",
};

export default function ZAlgorithmPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="z-algorithm" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <ZVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
