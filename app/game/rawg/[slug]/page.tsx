import ClientOnly from "@/components/ClientOnly";
import RAWGGameDetailClient from "@/components/RAWGGameDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function RAWGGamePage({ params }: Props) {
  const { slug } = await params;
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <RAWGGameDetailClient slug={slug} />
    </ClientOnly>
  );
}
