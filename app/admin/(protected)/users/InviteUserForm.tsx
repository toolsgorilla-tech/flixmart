"use client";

import { useFormState } from "react-dom";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";
import { Input, Select } from "@/components/admin/ui/Field";
import { SubmitButton } from "@/components/admin/ui/SubmitButton";
import { inviteUserAction, type InviteUserState } from "./actions";

const initialState: InviteUserState = {};

export default function InviteUserForm() {
  const [state, formAction] = useFormState(inviteUserAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-semibold text-red-300">
          <AlertCircle size={14} /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2.5 text-xs font-semibold text-emerald-300">
          <CheckCircle2 size={14} /> Invite sent.
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Input name="email" type="email" placeholder="teammate@company.com" required className="min-w-[220px] flex-1" />
        <Select name="role" defaultValue="editor" className="w-36">
          <option value="editor">Editor</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </Select>
        <SubmitButton pendingText="Sending…">
          <UserPlus size={14} /> Invite
        </SubmitButton>
      </div>
    </form>
  );
}
