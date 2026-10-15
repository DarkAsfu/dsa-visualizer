import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";

export const metadata = {
  title: "Cycle Detection — DSA Visualizer",
  description: "Tortoise and hare race down the chain — a meeting means a loop.",
};

export default function CycleDetectionPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="cycle-detection" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <LinkedListVisualizer initialMode="cycle" />
        </Suspense>
      </div>
    </main>
  );
}
