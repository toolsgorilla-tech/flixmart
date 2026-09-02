"use client";

import { useFormState } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardBody } from "@/components/admin/ui/Card";
import { Input, Label, FieldGroup } from "@/components/admin/ui/Field";
import { SubmitButton } from "@/components/admin/ui/SubmitButton";
import { updateSettingsAction, type SettingsFormState } from "./actions";
import type { SiteSettingsRow } from "@/types/database";

const initialState: SettingsFormState = {};

export default function SettingsForm({ settings }: { settings: SiteSettingsRow }) {
  const [state, formAction] = useFormState(updateSettingsAction, initialState);
  const social = settings.social_links ?? {};

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
          <AlertCircle size={16} /> {state.error}
        </div>
      )}
      {state.success && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
          <CheckCircle2 size={16} /> Settings saved.
        </div>
      )}

      <Card>
        <CardHeader title="Business Information" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="business_name">Business name</Label>
            <Input id="business_name" name="business_name" defaultValue={settings.business_name} required />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="tagline">Tagline</Label>
            <Input id="tagline" name="tagline" defaultValue={settings.tagline ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input id="logo_url" name="logo_url" defaultValue={settings.logo_url ?? ""} placeholder="Paste from Media Library" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="favicon_url">Favicon URL</Label>
            <Input id="favicon_url" name="favicon_url" defaultValue={settings.favicon_url ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="default_currency">Default currency</Label>
            <Input id="default_currency" name="default_currency" defaultValue={settings.default_currency} />
          </FieldGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Contact" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="whatsapp" hint="digits only, with country code">WhatsApp number</Label>
            <Input id="whatsapp" name="whatsapp" defaultValue={settings.whatsapp ?? ""} placeholder="e.g. 923044603133" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={settings.phone ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" defaultValue={settings.email ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="address">Address</Label>
            <Input id="address" name="address" defaultValue={settings.address ?? ""} />
          </FieldGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Pakistani Payment Methods" description="Keep the checkout payment number easy to update." />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="payment_account">Payment account / mobile number</Label>
            <Input id="payment_account" name="payment_account" defaultValue={(settings.theme?.paymentAccount as string) ?? "03044603133"} placeholder="03044603133" />
          </FieldGroup>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-slate-400">
            <p className="font-semibold text-white">Enabled methods</p>
            <p className="mt-1">Easypaisa · JazzCash · NayaPay</p>
            <p className="mt-2">The checkout shows the same account number for each method until you add separate accounts.</p>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Social Links" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="social_facebook">Facebook</Label>
            <Input id="social_facebook" name="social_facebook" defaultValue={social.facebook ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="social_instagram">Instagram</Label>
            <Input id="social_instagram" name="social_instagram" defaultValue={social.instagram ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="social_twitter">Twitter / X</Label>
            <Input id="social_twitter" name="social_twitter" defaultValue={social.twitter ?? ""} />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="social_youtube">YouTube</Label>
            <Input id="social_youtube" name="social_youtube" defaultValue={social.youtube ?? ""} />
          </FieldGroup>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Integrations" />
        <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FieldGroup>
            <Label htmlFor="google_analytics_id">Google Analytics ID</Label>
            <Input id="google_analytics_id" name="google_analytics_id" defaultValue={settings.google_analytics_id ?? ""} placeholder="G-XXXXXXXXXX" />
          </FieldGroup>
          <FieldGroup>
            <Label htmlFor="meta_pixel_id">Meta Pixel ID</Label>
            <Input id="meta_pixel_id" name="meta_pixel_id" defaultValue={settings.meta_pixel_id ?? ""} />
          </FieldGroup>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <SubmitButton>Save Settings</SubmitButton>
      </div>
    </form>
  );
}
