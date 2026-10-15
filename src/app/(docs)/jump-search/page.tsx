import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import SearchVisualizer from "@/components/SearchVisualizer";

export const metadata = {
  title: "Jump Search — DSA Visualizer",
  description: "Leap in √n blocks, then scan inside: jump search visualized.",
};

export default function JumpSearchPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="jump-search" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SearchVisualizer initialAlgo="jump" />
        </Suspense>
      </div>
    </main>
  );
}
