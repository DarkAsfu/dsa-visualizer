import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import TraversalVisualizer from "@/components/TraversalVisualizer";

export const metadata = {
  title: "Tree Traversals — DSA Visualizer",
  description: "Inorder, preorder, postorder and level order walks.",
};

export default function TraversalsPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="tree-traversals" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <TraversalVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
