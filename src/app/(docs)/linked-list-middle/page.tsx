import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import MiddleNthVisualizer from "@/components/MiddleNthVisualizer";

export const metadata = {
  title: "Middle & Nth from End — DSA Visualizer",
  description: "Runners measure the chain: middle and Nth-from-end.",
};

export default function LinkedListMiddlePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="linked-list-middle" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <MiddleNthVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
