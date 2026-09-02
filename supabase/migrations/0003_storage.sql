-- ============================================================================
-- Storage — public `media` bucket used by the Media Library feature.
-- Files are publicly readable (product images, logos, blog images all need
-- to render on the public site); writes are restricted to staff.
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "media_bucket_public_read"
on storage.objects for select
using (bucket_id = 'media');

create policy "media_bucket_staff_insert"
on storage.objects for insert
with check (bucket_id = 'media' and public.is_staff());

create policy "media_bucket_staff_update"
on storage.objects for update
using (bucket_id = 'media' and public.is_staff());

create policy "media_bucket_staff_delete"
on storage.objects for delete
using (bucket_id = 'media' and public.is_staff());
