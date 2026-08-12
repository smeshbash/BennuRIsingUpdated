-- Create a new storage bucket for images
insert into storage.buckets (id, name, public) values ('images', 'images', true);

-- Allow public read access to the images bucket
create policy "Public Access" on storage.objects for select using ( bucket_id = 'images' );

-- Allow authenticated admins to upload images
create policy "Admin Upload Access" on storage.objects for insert with check ( bucket_id = 'images' and public.is_admin() );

-- Allow authenticated admins to update images
create policy "Admin Update Access" on storage.objects for update using ( bucket_id = 'images' and public.is_admin() );

-- Allow authenticated admins to delete images
create policy "Admin Delete Access" on storage.objects for delete using ( bucket_id = 'images' and public.is_admin() );
