"use client";

import dynamic from "next/dynamic";

const ProfileClient = dynamic(() => import("@/components/ProfileClient"), {
  ssr: false,
  loading: () => <div className="min-h-screen" />,
});

export default function ProfilePage() {
  return <ProfileClient />;
}
