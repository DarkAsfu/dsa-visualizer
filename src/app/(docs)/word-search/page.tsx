import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { BacktrackExtras } from "@/components/TopicSections";
import WordSearchVisualizer from "@/components/WordSearchVisualizer";

export const metadata = {
  title: "Word Search — DSA Visualizer",
  description: "Grid DFS with a visited set: match letters, backtrack dead ends.",
};

export default function WordSearchPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="word-search" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <WordSearchVisualizer />
        </Suspense>
      </div>
      <BacktrackExtras />
    </main>
  );
}
