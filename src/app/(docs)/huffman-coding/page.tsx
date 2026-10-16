import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import HuffmanVisualizer from "@/components/HuffmanVisualizer";

export const metadata = {
  title: "Huffman Coding — DSA Visualizer",
  description: "Merge the two smallest: optimal prefix codes from frequencies.",
};

export default function HuffmanCodingPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="huffman-coding" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <HuffmanVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
