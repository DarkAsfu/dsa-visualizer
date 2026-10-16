import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import LisVisualizer from "@/components/LisVisualizer";

export const metadata = {
  title: "LIS — DSA Visualizer",
  description: "Longest increasing subsequence: extend the best smaller ending.",
};

export default function LisPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="lis" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <LisVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
