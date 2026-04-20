import ClientOnly from "@/components/ClientOnly";
import DesignSystemClient from "@/components/DesignSystemClient";

export default function DesignSystemPage() {
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <DesignSystemClient />
    </ClientOnly>
  );
}
