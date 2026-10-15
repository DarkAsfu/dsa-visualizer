import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import NGEVisualizer from "@/components/NGEVisualizer";

export const metadata = {
  title: "Next Greater Element — DSA Visualizer",
  description: "Right-to-left scan with a monotonic stack in O(n).",
};

export default function NGEPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="next-greater" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <NGEVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
