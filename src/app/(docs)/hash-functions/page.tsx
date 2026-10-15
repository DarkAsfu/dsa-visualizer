import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import HashFnVisualizer from "@/components/HashFnVisualizer";

export const metadata = {
  title: "Hash Functions — DSA Visualizer",
  description: "Compare char-sum, poly-31, djb2 and FNV-1a spread.",
};

export default function HashFnPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="hash-functions" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <HashFnVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
