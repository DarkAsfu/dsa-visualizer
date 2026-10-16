import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import { BacktrackExtras } from "@/components/TopicSections";
import SudokuVisualizer from "@/components/SudokuVisualizer";

export const metadata = {
  title: "Sudoku Solver — DSA Visualizer",
  description: "MRV backtracking: emptiest-constrained cell first, erase on dead end.",
};

export default function SudokuSolverPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="sudoku-solver" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <SudokuVisualizer />
        </Suspense>
      </div>
      <BacktrackExtras />
    </main>
  );
}
