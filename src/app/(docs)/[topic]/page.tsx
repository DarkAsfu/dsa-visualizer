import { notFound } from "next/navigation";
import TopicPlaceholder from "@/components/TopicPlaceholder";
import { ALL_SLUGS, ALL_TOPICS, STATIC_SLUGS } from "@/lib/topics";

export function generateStaticParams() {
  return ALL_SLUGS.filter((s) => !STATIC_SLUGS.has(s)).map((slug) => ({
    topic: slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const data = ALL_TOPICS[topic];
  if (!data) return { title: "Topic not found — DSA Visualizer" };
  return {
    title: `${data.title} — DSA Visualizer`,
    description: data.desc,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const data = ALL_TOPICS[topic];
  if (!data) notFound();
  return <TopicPlaceholder topic={data} />;
}
