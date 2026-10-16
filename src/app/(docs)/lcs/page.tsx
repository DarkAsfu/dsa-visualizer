import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import LcsVisualizer from "@/components/LcsVisualizer";

export const metadata = {
  title: "LCS — DSA Visualizer",
  description: "Longest common subsequence grid with backtrack reconstruction.",
};

export default function LcsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="lcs" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <LcsVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
