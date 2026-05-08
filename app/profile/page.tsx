import ClientOnly from "@/components/ClientOnly";
import ProfileClient from "@/components/ProfileClient";

export default function ProfilePage() {
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <ProfileClient />
    </ClientOnly>
  );
}
