import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import HashTableVisualizer from "@/components/HashTableVisualizer";

export const metadata = {
  title: "Hash Table — DSA Visualizer",
  description: "Chaining hash table: hash, bucket, collide, chain.",
};

export default function HashTablePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="hash-table" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <HashTableVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
