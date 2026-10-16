import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import KaratsubaVisualizer from "@/components/KaratsubaVisualizer";

export const metadata = {
  title: "Karatsuba — DSA Visualizer",
  description: "Three half-multiplies beat four: fast big-int multiplication.",
};

export default function KaratsubaPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="karatsuba" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <KaratsubaVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
