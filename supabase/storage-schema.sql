insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'crm-model-photos',
  'crm-model-photos',
  true,
  3145728,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "crm_model_photos_select" on storage.objects;
drop policy if exists "crm_model_photos_insert" on storage.objects;
drop policy if exists "crm_model_photos_update" on storage.objects;
drop policy if exists "crm_model_photos_delete" on storage.objects;

create policy "crm_model_photos_select"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'crm-model-photos');
