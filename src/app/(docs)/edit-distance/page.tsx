import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import EditDistanceVisualizer from "@/components/EditDistanceVisualizer";

export const metadata = {
  title: "Edit Distance — DSA Visualizer",
  description: "Insert, delete, replace grid with alignment backtrack.",
};

export default function EditDistancePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="edit-distance" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <EditDistanceVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
