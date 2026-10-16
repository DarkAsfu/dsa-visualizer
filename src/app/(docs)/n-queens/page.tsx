import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { BacktrackExtras } from "@/components/TopicSections";
import NQueensVisualizer from "@/components/NQueensVisualizer";

export const metadata = {
  title: "N-Queens — DSA Visualizer",
  description: "Place queens safely: try a column, hit conflict, backtrack.",
};

export default function NQueensPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="n-queens" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <NQueensVisualizer />
        </Suspense>
      </div>
      <BacktrackExtras />
    </main>
  );
}
