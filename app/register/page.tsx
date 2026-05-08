import ClientOnly from "@/components/ClientOnly";
import AuthPage from "@/components/AuthPage";

export default function RegisterPage() {
  return (
    <ClientOnly fallback={<div className="min-h-screen" />}>
      <AuthPage mode="register" />
    </ClientOnly>
  );
}
