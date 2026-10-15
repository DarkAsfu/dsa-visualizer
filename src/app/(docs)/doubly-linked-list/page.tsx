import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import DoublyVisualizer from "@/components/DoublyVisualizer";

export const metadata = {
  title: "Doubly Linked List — DSA Visualizer",
  description: "Prev and next links both ways, plus circular mode.",
};

export default function DoublyLinkedListPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="doubly-linked-list" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <DoublyVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
