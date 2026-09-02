import { Card, CardBody } from "./Card";

/**
 * Shared "Supabase isn't connected yet" banner. Every admin page rendered
 * before Supabase is configured shows one of these instead of crashing —
 * this component replaces what used to be ~10 near-identical copies of
 * the same markup scattered across each page.tsx.
 */
export function NotConfiguredNotice({
  title = "Supabase isn't connected yet",
  children
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <Card className="border-amber-500/20 bg-amber-500/[0.06]">
      <CardBody>
        <p className="text-sm font-semibold text-amber-300">{title}</p>
        {children && <div className="mt-1 text-xs text-amber-200/80">{children}</div>}
      </CardBody>
    </Card>
  );
}
