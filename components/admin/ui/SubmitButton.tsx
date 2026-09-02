"use client";

import { useFormStatus } from "react-dom";
import { Button } from "./Button";

/**
 * Next.js 14 / React 18 note: `useFormStatus` only reports the status of
 * the nearest parent <form>, and must be called from a component rendered
 * *inside* that form — not the component that renders the form itself.
 * That's why every form below renders <SubmitButton> as a child rather
 * than reading pending state at the top of the form component.
 */
export function SubmitButton({
  children,
  pendingText,
  ...props
}: React.ComponentProps<typeof Button> & { pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? (pendingText ?? "Saving…") : children}
    </Button>
  );
}
