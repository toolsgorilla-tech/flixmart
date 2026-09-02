"use client";

import { useFormState } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/admin/ui/Card";
import { Input, Textarea, Label, FieldGroup } from "@/components/admin/ui/Field";
import { Switch } from "@/components/admin/ui/Switch";
import { SubmitButton } from "@/components/admin/ui/SubmitButton";
import { updateHeroAction, type HeroFormState } from "./actions";
import type { HeroContentRow } from "@/types/database";
import { useState } from "react";

const initialState: HeroFormState = {};

export default function HeroForm({ hero }: { hero: HeroContentRow }) {
  const [state, formAction] = useFormState(updateHeroAction, initialState);
  const [animationsEnabled, setAnimationsEnabled] = useState(hero.animations_enabled);

  const chipsText = hero.category_chips.map((c) => `${c.icon} | ${c.label}`).join("\n");
  const tickerText = hero.ticker_items.map((c) => `${c.icon} | ${c.label}`).join("\n");

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
          <CheckCircle2 size={16} /> Hero content saved.
        </div>
      )}

      <Card>
        <CardHeader title="Headline & Copy" />
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup>
              <Label htmlFor="headline">Headline (line 1)</Label>
              <Input id="headline" name="headline" defaultValue={hero.headline} required />
            </FieldGroup>
            <FieldGroup>
              <Label htmlFor="headline_highlight">Headline (highlighted line 2)</Label>
              <Input id="headline_highlight" name="headline_highlight" defaultValue={hero.headline_highlight} required />
            </FieldGroup>
          </div>
          <FieldGroup>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea id="subtitle" name="subtitle" defaultValue={hero.subtitle} rows={3} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="badge_text">Top badge text</Label>
            <Input id="badge_text" name="badge_text" defaultValue={hero.badge_text} />
          </FieldGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Buttons" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="primary_button_label">Primary button label</Label>
            <Input id="primary_button_label" name="primary_button_label" defaultValue={hero.primary_button_label} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="primary_button_url">Primary button URL</Label>
            <Input id="primary_button_url" name="primary_button_url" defaultValue={hero.primary_button_url} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="secondary_button_label">Secondary button label</Label>
            <Input id="secondary_button_label" name="secondary_button_label" defaultValue={hero.secondary_button_label} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="secondary_button_url">Secondary button URL</Label>
            <Input id="secondary_button_url" name="secondary_button_url" defaultValue={hero.secondary_button_url} />
          </FieldGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Category Chips & Ticker" description="One per line, formatted as: IconName | Label. Icon names must match a lucide-react icon (e.g. Trophy, Film, Sparkles, Zap)." />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="category_chips">Category chips</Label>
            <Textarea id="category_chips" name="category_chips" defaultValue={chipsText} rows={5} className="font-mono text-xs" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="ticker_items">Bottom ticker items</Label>
            <Textarea id="ticker_items" name="ticker_items" defaultValue={tickerText} rows={5} className="font-mono text-xs" />
          </FieldGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Animations" />
        <CardBody className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Enable Hero animations</p>
            <p className="text-xs text-slate-500">Cursor glow, floating cards and entrance transitions.</p>
          </div>
          <Switch checked={animationsEnabled} onChange={setAnimationsEnabled} />
          <input type="hidden" name="animations_enabled" value={animationsEnabled ? "on" : "off"} />
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>Save Changes</SubmitButton>
      </div>
    </form>
  );
}
