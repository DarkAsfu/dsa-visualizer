import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";

export const metadata = {
  title: "Reverse Linked List — DSA Visualizer",
  description: "Flip every arrow in one pass with prev, curr and next.",
};

export default function ReverseLinkedListPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="reverse-linked-list" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <LinkedListVisualizer initialMode="reverse" />
        </Suspense>
      </div>
    </main>
  );
}
