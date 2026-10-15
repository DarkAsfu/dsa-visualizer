import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { RecursionExtras } from "@/components/TopicSections";
import RecursionVisualizer from "@/components/RecursionVisualizer";

export const metadata = {
  title: "Recursion — DSA Visualizer",
  description: "Watch the call stack grow: factorial chain and fibonacci tree, stepped through.",
};

export default function RecursionPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="recursion" />

      <div className="mt-5">
        <Suspense
          fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}
        >
          <RecursionVisualizer />
        </Suspense>
      </div>

      <RecursionExtras />
    </main>
  );
}
