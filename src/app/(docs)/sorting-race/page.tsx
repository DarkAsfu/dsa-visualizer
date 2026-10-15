import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import RaceVisualizer from "@/components/RaceVisualizer";

export const metadata = {
  title: "Sorting Race — DSA Visualizer",
  description: "Ten sorters, one array, one clock.",
};

export default function SortingRacePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="sorting-race" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <RaceVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
