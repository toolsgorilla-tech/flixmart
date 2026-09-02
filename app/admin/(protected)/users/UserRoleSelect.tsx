"use client";

import { useTransition } from "react";
import { Select } from "@/components/admin/ui/Field";
import { updateUserRoleAction } from "./actions";
import type { AppRole } from "@/types/database";

export default function UserRoleSelect({ userId, currentRole }: { userId: string; currentRole: AppRole }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={currentRole}
      disabled={isPending}
      onChange={(e) => startTransition(() => updateUserRoleAction(userId, e.target.value as AppRole))}
      className="h-8 w-28 text-xs"
    >
      <option value="editor">Editor</option>
      <option value="manager">Manager</option>
      <option value="admin">Admin</option>
    </Select>
  );
}
