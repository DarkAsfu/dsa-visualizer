import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import StackQueueVisualizer from "@/components/StackQueueVisualizer";

export const metadata = {
  title: "Stack — DSA Visualizer",
  description: "Push, pop, peek — plus bracket matching. LIFO, stepped through.",
};

export default function StackPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="stack" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <StackQueueVisualizer initialMode="stack" />
        </Suspense>
      </div>
    </main>
  );
}
