import Sidebar from "@/components/Sidebar";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full items-start">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
