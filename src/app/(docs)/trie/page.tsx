import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import TrieVisualizer from "@/components/TrieVisualizer";

export const metadata = {
  title: "Trie — DSA Visualizer",
  description: "Prefix tree insert and search per character.",
};

export default function TriePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="trie" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <TrieVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
