import { Suspense } from "react";
import PageHeader from "@/components/PageHeader";
import PalinAnagramVisualizer from "@/components/PalinAnagramVisualizer";

export const metadata = {
  title: "Palindrome & Anagram — DSA Visualizer",
  description: "Mirror test from both ends plus letter-frequency comparison.",
};

export default function PalindromeAnagramPage() {
  return (
    <main className="w-full min-w-0 px-4 py-7 lg:px-8">
      <PageHeader slug="palindrome-anagram" />
      <div className="mt-5">
        <Suspense fallback={<div className="p-8 text-center font-mono text-sm">loading…</div>}>
          <PalinAnagramVisualizer />
        </Suspense>
      </div>
    </main>
  );
}
