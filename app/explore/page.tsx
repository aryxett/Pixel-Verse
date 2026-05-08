import ClientOnly from "@/components/ClientOnly";
import ExploreClient from "@/components/ExploreClient";

export default function ExplorePage() {
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <ExploreClient />
    </ClientOnly>
  );
}
