import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { Card, CardHeader, CardBody } from "@/components/admin/ui/Card";
import { NotConfiguredNotice } from "@/components/admin/ui/NotConfiguredNotice";
import { Badge } from "@/components/admin/ui/Badge";
import type { Profile } from "@/types/database";
import UserRoleSelect from "./UserRoleSelect";
import InviteUserForm from "./InviteUserForm";

export const metadata = { title: "Users" };

export default async function UsersPage() {
  await requireRole("admin"); // page-level guard, in addition to the middleware ADMIN_ONLY_PREFIXES check
  const configured = isSupabaseConfigured();

  let profiles: Profile[] = [];
  if (configured) {
    const supabase = await createClient();
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: true });
    profiles = (data ?? []) as Profile[];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Users</h1>
        <p className="mt-1 text-sm text-slate-400">Manage staff access and roles. Admin-only area.</p>
      </div>

      {!configured ? (
        <NotConfiguredNotice title="Connect Supabase to manage users" />
      ) : (
        <>
          <Card>
            <CardHeader title="Invite a teammate" description="They'll receive an email to set their password." />
            <CardBody>
              <InviteUserForm />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="All users" />
            <CardBody className="space-y-2.5">
              {profiles.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{p.full_name ?? "—"}</p>
                    <p className="text-xs text-slate-500">{p.id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={p.role === "admin" ? "info" : "neutral"}>{p.role}</Badge>
                    <UserRoleSelect userId={p.id} currentRole={p.role} />
                  </div>
                </div>
              ))}
              {profiles.length === 0 && <p className="text-sm text-slate-500">No users yet.</p>}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
