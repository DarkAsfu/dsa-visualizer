import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import LinkedListVisualizer from "@/components/LinkedListVisualizer";

export const metadata = {
  title: "Linked List — DSA Visualizer",
  description: "Insert, delete, reverse and cycle-detect on a live chain.",
};

export default function SinglyLinkedListPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="singly-linked-list" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <LinkedListVisualizer initialMode="singly" />
        </Suspense>
      </div>
    </main>
  );
}
