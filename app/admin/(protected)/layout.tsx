import { requireUser } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-white/[0.06] lg:block">
        <div className="fixed h-screen w-64">
          <Sidebar role={user.profile.role} />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar fullName={user.profile.full_name ?? user.email ?? "Admin"} role={user.profile.role} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
