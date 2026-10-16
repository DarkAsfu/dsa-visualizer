import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import CoinChangeVisualizer from "@/components/CoinChangeVisualizer";

export const metadata = {
  title: "Coin Change — DSA Visualizer",
  description: "Min coins table: try every coin for each amount.",
};

export default function CoinChangePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="coin-change" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <CoinChangeVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
