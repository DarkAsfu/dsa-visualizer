import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import BSTVisualizer from "@/components/BSTVisualizer";

export const metadata = {
  title: "Binary Search Tree — DSA Visualizer",
  description: "BST insert, delete and search step by step.",
};

export default function BSTPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="bst" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <BSTVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
