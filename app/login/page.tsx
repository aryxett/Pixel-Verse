import ClientOnly from "@/components/ClientOnly";
import AuthPage from "@/components/AuthPage";

export default function LoginPage() {
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <AuthPage mode="login" />
    </ClientOnly>
  );
}
