import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { BitExtras } from "@/components/TopicSections";
import BitPlayground from "@/components/BitPlayground";

export const metadata = {
  title: "Bit Manipulation — DSA Visualizer",
  description: "AND, OR, XOR, NOT and shifts on 8 bits, resolved bit by bit.",
};

export default function BitPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bit-manipulation" />

      <div className="mt-5">
        <Suspense
          fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}
        >
          <BitPlayground />
        </Suspense>
      </div>

      <BitExtras />
    </main>
  );
}
