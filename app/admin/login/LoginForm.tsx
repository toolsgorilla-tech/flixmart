"use client";

import { useFormState } from "react-dom";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { Input } from "@/components/admin/ui/Field";
import { SubmitButton } from "@/components/admin/ui/SubmitButton";

const initialState: LoginState = {};

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction] = useFormState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-7 space-y-4">
      <input type="hidden" name="next" value={next} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3.5 py-2.5 text-xs font-semibold text-red-300">
          <AlertCircle size={14} /> {state.error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-300">Email</label>
        <div className="relative">
          <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input type="email" name="email" required placeholder="you@company.com" className="pl-10" autoComplete="email" />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold text-slate-300">Password</label>
        <div className="relative">
          <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <Input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="pl-10"
            autoComplete="current-password"
          />
        </div>
      </div>

      <SubmitButton pendingText="Signing in…" className="w-full">
        Sign in
      </SubmitButton>
    </form>
  );
}
