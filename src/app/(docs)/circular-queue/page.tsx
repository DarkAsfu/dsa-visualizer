import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import CircVisualizer from "@/components/CircVisualizer";

export const metadata = {
  title: "Circular Queue — DSA Visualizer",
  description: "Ring buffer enqueue and dequeue with wrap-around.",
};

export default function CircPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="circular-queue" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <CircVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
