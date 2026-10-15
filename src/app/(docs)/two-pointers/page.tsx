import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import TwoPointersVisualizer from "@/components/TwoPointersVisualizer";

export const metadata = {
  title: "Two Pointers — DSA Visualizer",
  description: "Pair sum, container water and duplicate removal with two pointers.",
};

export default function TwoPointersPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="two-pointers" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <TwoPointersVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
