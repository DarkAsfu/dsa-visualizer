import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { BacktrackExtras } from "@/components/TopicSections";
import RatMazeVisualizer from "@/components/RatMazeVisualizer";

export const metadata = {
  title: "Rat in a Maze — DSA Visualizer",
  description: "DFS path search: step in, dead end, step back — count the routes.",
};

export default function RatInMazePage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="rat-in-maze" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <RatMazeVisualizer />
        </Suspense>
      </div>
      <BacktrackExtras />
    </main>
  );
}
