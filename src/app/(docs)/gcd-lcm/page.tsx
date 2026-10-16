import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import GcdVisualizer from "@/components/GcdVisualizer";

export const metadata = {
  title: "GCD & LCM — DSA Visualizer",
  description: "Euclid's algorithm: remainders shrink to the greatest divisor.",
};

export default function GcdLcmPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="gcd-lcm" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <GcdVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
