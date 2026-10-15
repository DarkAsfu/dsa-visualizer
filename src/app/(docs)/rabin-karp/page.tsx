import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import RabinKarpVisualizer from "@/components/RabinKarpVisualizer";

export const metadata = {
  title: "Rabin-Karp — DSA Visualizer",
  description: "Rolling hash windows with char-by-char verification.",
};

export default function RabinKarpPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="rabin-karp" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <RabinKarpVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
