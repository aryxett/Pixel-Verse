"use client";

import dynamic from "next/dynamic";

const HomePageInner = dynamic(() => import("@/components/HomePageInner"), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#050508]" />,
});

export default function HomePageClient() {
  return <HomePageInner />;
}
