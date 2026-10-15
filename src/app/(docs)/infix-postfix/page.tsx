import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import InfixVisualizer from "@/components/InfixVisualizer";

export const metadata = {
  title: "Infix to Postfix — DSA Visualizer",
  description: "Shunting-yard conversion with precedence and parentheses.",
};

export default function InfixPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="infix-postfix" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <InfixVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
