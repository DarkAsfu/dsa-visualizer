import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import MonoVisualizer from "@/components/MonoVisualizer";

export const metadata = {
  title: "Monotonic Stack — DSA Visualizer",
  description: "Keep the stack increasing by popping bigger elements.",
};

export default function MonoPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="monotonic-stack" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <MonoVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
