import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import ActivityVisualizer from "@/components/ActivityVisualizer";

export const metadata = {
  title: "Activity Selection — DSA Visualizer",
  description: "Earliest-finish greedy: pick compatible activities off a timeline.",
};

export default function ActivitySelectionPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="activity-selection" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <ActivityVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
