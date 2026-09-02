"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { Plus, Trash2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/admin/ui/Card";
import { Input, Textarea, Select, Label, FieldGroup } from "@/components/admin/ui/Field";
import { Switch } from "@/components/admin/ui/Switch";
import { Button } from "@/components/admin/ui/Button";
import { SubmitButton } from "@/components/admin/ui/SubmitButton";
import type { ProductFormState } from "./actions";
import type { ProductWithPlans, CategoryRow } from "@/types/database";

interface PlanDraft {
  key: string;
  label: string;
  price: string;
  original_price: string;
  duration: string;
  is_free: boolean;
  price_tbd: boolean;
  badge: string;
}

function emptyPlan(): PlanDraft {
  return {
    key: Math.random().toString(36).slice(2),
    label: "",
    price: "",
    original_price: "",
    duration: "1 month",
    is_free: false,
    price_tbd: false,
    badge: ""
  };
}

export default function ProductForm({
  categories,
  product,
  action,
  submitLabel
}: {
  categories: CategoryRow[];
  product?: ProductWithPlans;
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, {});
  const [plans, setPlans] = useState<PlanDraft[]>(
    product?.product_plans.length
      ? product.product_plans
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((p) => ({
            key: p.id,
            label: p.label,
            price: String(p.price),
            original_price: p.original_price != null ? String(p.original_price) : "",
            duration: p.duration,
            is_free: p.is_free,
            price_tbd: p.price_tbd,
            badge: p.badge ?? ""
          }))
      : [emptyPlan()]
  );
  const [isFeatured, setIsFeatured] = useState(product?.is_featured ?? false);
  const [isTrending, setIsTrending] = useState(product?.is_trending ?? false);

  function updatePlan(key: string, patch: Partial<PlanDraft>) {
    setPlans((prev) => prev.map((p) => (p.key === key ? { ...p, ...patch } : p)));
  }

  const faqsText = (product?.faqs ?? []).map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");

  return (
    <form action={formAction} className="space-y-6">
      {/* Passthrough for fields with no dedicated UI yet (e.g. IPTV metadata
          like isIPTV/iptvTier/quality/contentRegions, set by the initial
          catalog migration and read by the product detail page). Without
          this, saving the form would silently overwrite `specifications`
          to `{}` and wipe that data — see actions.ts's buildInputFromForm. */}
      <input type="hidden" name="specifications" value={JSON.stringify(product?.specifications ?? {})} />
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}

      <Card>
        <CardHeader title="Basics" />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="name">Product name</Label>
              <Input id="name" name="name" defaultValue={product?.name} required />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="slug" hint="auto-generated if empty">Slug</Label>
              <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="e.g. netflix-premium" />
            </FieldGroup>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="category_id">Category</Label>
              <Select id="category_id" name="category_id" defaultValue={product?.category_id ?? ""}>
                <option value="">— Uncategorized —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="status">Status</Label>
              <Select id="status" name="status" defaultValue={product?.status ?? "draft"}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" defaultValue={product?.tagline ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product?.description ?? ""} rows={4} />
          </FieldGroup>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="image_url">Image URL</Label>
              <Input id="image_url" name="image_url" defaultValue={product?.image_url ?? ""} placeholder="Paste from Media Library" />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="delivery_time">Delivery time</Label>
              <Input id="delivery_time" name="delivery_time" defaultValue={product?.delivery_time ?? "Within 30 minutes"} />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label htmlFor="badge">Badge</Label>
            <Select id="badge" name="badge" defaultValue={product?.badge ?? ""}>
              <option value="">None</option>
              <option value="Best Seller">Best Seller</option>
              <option value="New">New</option>
              <option value="Limited">Limited</option>
              <option value="Trending">Trending</option>
              <option value="Most Popular">Most Popular</option>
            </Select>
          </FieldGroup>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2.5">
              <Switch checked={isFeatured} onChange={setIsFeatured} />
              <span className="text-sm text-white">Featured</span>
              <input type="hidden" name="is_featured" value={isFeatured ? "on" : "off"} />
            </div>
            <div className="flex items-center gap-2.5">
              <Switch checked={isTrending} onChange={setIsTrending} />
              <span className="text-sm text-white">Trending</span>
              <input type="hidden" name="is_trending" value={isTrending ? "on" : "off"} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Pricing Plans" description="Add one or more purchasable plans for this product." />
        <CardBody className="space-y-4">
          {plans.map((plan, i) => (
            <div key={plan.key} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <FieldGroup>
                  <Label htmlFor={`plan-label-${plan.key}`}>Label</Label>
                  <Input
                    id={`plan-label-${plan.key}`}
                    name="plan_label"
                    value={plan.label}
                    onChange={(e) => updatePlan(plan.key, { label: e.target.value })}
                    placeholder="e.g. 1 Month"
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor={`plan-price-${plan.key}`}>Price (PKR)</Label>
                  <Input
                    id={`plan-price-${plan.key}`}
                    name="plan_price"
                    type="number"
                    step="0.01"
                    value={plan.price}
                    onChange={(e) => updatePlan(plan.key, { price: e.target.value })}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor={`plan-original-price-${plan.key}`}>Original price</Label>
                  <Input
                    id={`plan-original-price-${plan.key}`}
                    name="plan_original_price"
                    type="number"
                    step="0.01"
                    value={plan.original_price}
                    onChange={(e) => updatePlan(plan.key, { original_price: e.target.value })}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor={`plan-duration-${plan.key}`}>Duration</Label>
                  <Input
                    id={`plan-duration-${plan.key}`}
                    name="plan_duration"
                    value={plan.duration}
                    onChange={(e) => updatePlan(plan.key, { duration: e.target.value })}
                  />
                </FieldGroup>
                <FieldGroup>
                  <Label htmlFor={`plan-badge-${plan.key}`}>Badge</Label>
                  <Input
                    id={`plan-badge-${plan.key}`}
                    name="plan_badge"
                    value={plan.badge}
                    onChange={(e) => updatePlan(plan.key, { badge: e.target.value })}
                    placeholder="e.g. 24-Hour Trial"
                  />
                </FieldGroup>
                <div className="flex items-end gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={plan.is_free}
                      onChange={(e) => updatePlan(plan.key, { is_free: e.target.checked })}
                    />
                    Free
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                    <input
                      type="checkbox"
                      checked={plan.price_tbd}
                      onChange={(e) => updatePlan(plan.key, { price_tbd: e.target.checked })}
                    />
                    Price TBD
                  </label>
                  <input type="hidden" name="plan_is_free" value={plan.is_free ? "true" : "false"} />
                  <input type="hidden" name="plan_price_tbd" value={plan.price_tbd ? "true" : "false"} />
                  <button
                    type="button"
                    aria-label={`Remove plan${plan.label ? ` "${plan.label}"` : ""}`}
                    className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
                    onClick={() => setPlans((prev) => (prev.length > 1 ? prev.filter((p) => p.key !== plan.key) : prev))}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={() => setPlans((prev) => [...prev, emptyPlan()])}>
            <Plus size={14} /> Add plan
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Details" description="One item per line." />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="features">Features</Label>
            <Textarea id="features" name="features" defaultValue={(product?.features ?? []).join("\n")} rows={5} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="included">What's included</Label>
            <Textarea id="included" name="included" defaultValue={(product?.included ?? []).join("\n")} rows={5} />
          </FieldGroup>
          <FieldGroup className="sm:col-span-2">
            <Label htmlFor="faqs" hint='Format: "Q: question" then "A: answer", blank line between entries'>
              Product FAQs
            </Label>
            <Textarea id="faqs" name="faqs" defaultValue={faqsText} rows={6} className="font-mono text-xs" />
          </FieldGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="SEO" />
        <CardBody className="space-y-4">
          <FieldGroup>
            <Label htmlFor="seo_title">Meta title</Label>
            <Input id="seo_title" name="seo_title" defaultValue={product?.seo_title ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="seo_description">Meta description</Label>
            <Textarea id="seo_description" name="seo_description" defaultValue={product?.seo_description ?? ""} rows={2} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="seo_keywords">Keywords</Label>
            <Input id="seo_keywords" name="seo_keywords" defaultValue={product?.seo_keywords ?? ""} placeholder="comma, separated" />
          </FieldGroup>
        </CardBody>
      </Card>

      <div className="flex justify-end gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
      </div>
    </form>
  );
}
