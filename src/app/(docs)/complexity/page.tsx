import ComplexityChart from "@/components/ComplexityChart";
import PageHeader from "@/components/PageHeader";
import { ComplexityExtras } from "@/components/TopicSections";

export const metadata = {
  title: "Complexity — DSA Visualizer",
  description: "Big-O growth chart: compare how O(1) to O(n!) scale with input size.",
};

export default function ComplexityPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="complexity" />

      <div className="mt-5">
        <ComplexityChart />
      </div>

      <ComplexityExtras />
    </main>
  );
}
