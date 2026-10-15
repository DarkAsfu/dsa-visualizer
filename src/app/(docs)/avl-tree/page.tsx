import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import AVLVisualizer from "@/components/AVLVisualizer";

export const metadata = {
  title: "AVL Tree — DSA Visualizer",
  description: "Self-balancing BST with LL, RR, LR and RL rotations.",
};

export default function AVLPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="avl-tree" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <AVLVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
