import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import StackQueueVisualizer from "@/components/StackQueueVisualizer";

export const metadata = {
  title: "Queue — DSA Visualizer",
  description: "Enqueue, dequeue, front — plus bracket matching. FIFO, stepped through.",
};

export default function QueuePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="queue" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <StackQueueVisualizer initialMode="queue" />
        </Suspense>
      </div>
    </main>
  );
}
