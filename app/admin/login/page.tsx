import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import Image from "next/image";

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: { next?: string };
}) {
  const user = await getCurrentUser();
  if (user) redirect("/admin/dashboard");

  const { next } = searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-1/4 -top-1/4 h-[70%] w-[70%] rounded-full bg-red-600/20 blur-3xl" />
        <div className="absolute -right-1/4 top-0 h-[65%] w-[65%] rounded-full bg-purple-600/15 blur-3xl" />
      </div>

      <div className="w-full max-w-md rounded-3xl border border-white/[0.08] bg-white/[0.04] p-8 shadow-2xl backdrop-blur-2xl">
        <div className="flex flex-col items-center text-center">
          <Image src="/flixmart-logo.png" alt="FlixMart" width={112} height={56} className="h-14 w-auto object-contain" />
          <h1 className="mt-4 font-display text-xl font-bold text-white">FlixMart Admin</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to manage your marketplace.</p>
        </div>

        <LoginForm next={next ?? "/admin/dashboard"} />

        <p className="mt-6 text-center text-[11px] text-slate-500">
          Access is restricted to Admin, Editor and Manager accounts created by your organization.
        </p>
      </div>
    </div>
  );
}
