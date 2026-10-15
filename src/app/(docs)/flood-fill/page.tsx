import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import FloodFillVisualizer from "@/components/FloodFillVisualizer";

export const metadata = {
  title: "Flood Fill — DSA Visualizer",
  description: "Pour the bucket and watch color spread.",
};

export default function FloodFillPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="flood-fill" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <FloodFillVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
