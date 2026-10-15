import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import KMPVisualizer from "@/components/KMPVisualizer";

export const metadata = {
  title: "KMP — DSA Visualizer",
  description: "Knuth-Morris-Pratt: LPS table plus search without rewinding.",
};

export default function KMPPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="kmp" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <KMPVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
