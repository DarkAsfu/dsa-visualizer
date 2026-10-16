import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import HullVisualizer from "@/components/HullVisualizer";

export const metadata = {
  title: "Convex Hull — DSA Visualizer",
  description: "Graham scan: sort by angle, keep left turns, pop right turns.",
};

export default function ConvexHullPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="convex-hull" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <HullVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
