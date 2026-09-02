import { Card, CardBody } from "@/components/admin/ui/Card";
import { Construction } from "lucide-react";

export const metadata = { title: "SEO" };

export default function SeoStubPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">SEO</h1>
        <p className="mt-1 text-sm text-slate-400">Global meta defaults, sitemap and robots configuration.</p>
      </div>
      <Card>
        <CardBody className="flex flex-col items-center gap-3 py-14 text-center">
          <span className="rounded-2xl bg-red-500/10 p-3 text-red-300">
            <Construction size={22} />
          </span>
          <p className="font-semibold text-white">Coming in the next milestone</p>
          <p className="max-w-sm text-sm text-slate-500">
            The database table and RLS policies for this module already exist — this screen just has not been
            built yet. It is next in line after Milestone 1.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
