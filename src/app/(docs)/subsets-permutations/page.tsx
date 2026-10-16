import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { BacktrackExtras } from "@/components/TopicSections";
import SubsetsPermsVisualizer from "@/components/SubsetsPermsVisualizer";

export const metadata = {
  title: "Subsets & Permutations — DSA Visualizer",
  description: "Take-or-skip builds subsets; fix-position builds permutations.",
};

export default function SubsetsPermutationsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="subsets-permutations" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SubsetsPermsVisualizer />
        </Suspense>
      </div>
      <BacktrackExtras />
    </main>
  );
}
