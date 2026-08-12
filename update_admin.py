import re

with open('pages/AdminPages.tsx', 'r') as f:
    content = f.read()

# 1. Add content_creator to AdminRole
content = content.replace(
    "type AdminRole = 'super_admin' | 'content_manager' | 'volunteer_manager';",
    "type AdminRole = 'super_admin' | 'content_manager' | 'volunteer_manager' | 'content_creator';"
)

content = content.replace(
    "volunteer_manager: { label: 'Volunteer Manager', color: 'bg-green-100 text-green-700 border-green-200' },",
    "volunteer_manager: { label: 'Volunteer Manager', color: 'bg-green-100 text-green-700 border-green-200' },\n    content_creator: { label: 'Content Creator', color: 'bg-orange-100 text-orange-700 border-orange-200' },"
)

# 2. Update MENU_ITEMS
content = content.replace(
    "roles: ['super_admin', 'content_manager']",
    "roles: ['super_admin', 'content_manager', 'content_creator']"
)

# 3. Add ApprovalControls component
approval_controls = """
const ApprovalControls = ({ item, setItem, onSave, loading, userRole, userEmail }: any) => {
    const isCreator = userRole === 'content_creator';
    const isManager = userRole === 'content_manager' || userRole === 'super_admin';
    const status = item.approval_status || 'published';

    return (
        <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase">Status: 
                    <span className={`ml-2 px-2 py-1 rounded ${status === 'published' ? 'bg-green-100 text-green-700' : status === 'pending' ? 'bg-yellow-100 text-yellow-700' : status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                        {status.toUpperCase()}
                    </span>
                </span>
            </div>
            {status === 'rejected' && item.reviewer_comments && (
                <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-sm text-red-800">
                    <strong>Reviewer Comments:</strong> {item.reviewer_comments}
                </div>
            )}
            {isManager && status === 'pending' && (
                <div>
                    <textarea placeholder="Leave a comment for the creator (if rejecting)..." value={item.reviewer_comments || ''} onChange={e => setItem({...item, reviewer_comments: e.target.value})} className="w-full border p-2 rounded-lg text-sm mb-2" rows={2} />
                </div>
            )}
            <div className="flex gap-2">
                {isCreator && (
                    <>
                        <button onClick={() => onSave('draft')} disabled={loading} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200">Save Draft</button>
                        <button onClick={() => onSave('pending')} disabled={loading} className="flex-1 bg-brand-blue text-white py-2 rounded-lg font-bold hover:bg-blue-700">Submit for Review</button>
                    </>
                )}
                {isManager && (
                    <>
                        {status === 'pending' && <button onClick={() => onSave('rejected')} disabled={loading} className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg font-bold hover:bg-red-200">Request Changes</button>}
                        <button onClick={() => onSave('published')} disabled={loading} className="flex-1 bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600">{status === 'pending' ? 'Approve & Publish' : 'Publish Directly'}</button>
                        {status !== 'draft' && status !== 'pending' && <button onClick={() => onSave('draft')} disabled={loading} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200">Unpublish (Draft)</button>}
                    </>
                )}
            </div>
        </div>
    );
};
"""

content = content.replace(
    "const BlogManager = () => {",
    approval_controls + "\nconst BlogManager = ({ userRole, userEmail }: { userRole: AdminRole | null, userEmail: string | undefined }) => {"
)

# 4. Update AdminDashboard to pass props
for manager in ['BlogManager', 'GalleryManager', 'TeamManager', 'TestimonialsManager', 'ImpactManager', 'MissionManager']:
    content = content.replace(
        f"<{manager} />",
        f"<{manager} userRole={{adminRole}} userEmail={{user?.email}} />"
    )

# 5. Update managers to accept props and use ApprovalControls
managers = ['GalleryManager', 'TeamManager', 'TestimonialsManager', 'ImpactManager', 'MissionManager']
for manager in managers:
    content = content.replace(
        f"const {manager} = () => {{",
        f"const {manager} = ({{ userRole, userEmail }}: {{ userRole: AdminRole | null, userEmail: string | undefined }}) => {{"
    )

# 6. Update fetch logic in managers
fetch_replacements = [
    ("const { data } = await supabase.from('blog_posts').select('*').order('created_at', {ascending: false});", 
     "let query = supabase.from('blog_posts').select('*').order('created_at', {ascending: false}); if (userRole === 'content_creator') query = query.eq('author_email', userEmail); const { data } = await query;"),
    ("const { data } = await supabase.from('gallery_albums').select('*, gallery_images(*)').order('created_at', {ascending: false});",
     "let query = supabase.from('gallery_albums').select('*, gallery_images(*)').order('created_at', {ascending: false}); if (userRole === 'content_creator') query = query.eq('author_email', userEmail); const { data } = await query;"),
    ("const { data } = await supabase.from('team_members').select('*').order('created_at', {ascending: false});",
     "let query = supabase.from('team_members').select('*').order('created_at', {ascending: false}); if (userRole === 'content_creator') query = query.eq('author_email', userEmail); const { data } = await query;"),
    ("const { data } = await supabase.from('testimonials').select('*').order('created_at', {ascending: false});",
     "let query = supabase.from('testimonials').select('*').order('created_at', {ascending: false}); if (userRole === 'content_creator') query = query.eq('author_email', userEmail); const { data } = await query;"),
    ("const { data: stories } = await supabase.from('impact_stories').select('*').order('created_at', {ascending: false});",
     "let query = supabase.from('impact_stories').select('*').order('created_at', {ascending: false}); if (userRole === 'content_creator') query = query.eq('author_email', userEmail); const { data: stories } = await query;"),
    ("const { data: groups } = await supabase.from('mission_groups').select('*').order('created_at', {ascending: false});",
     "let query = supabase.from('mission_groups').select('*').order('created_at', {ascending: false}); if (userRole === 'content_creator') query = query.eq('author_email', userEmail); const { data: groups } = await query;"),
    ("const { data: causes } = await supabase.from('mission_causes').select('*').order('created_at', {ascending: false});",
     "let query = supabase.from('mission_causes').select('*').order('created_at', {ascending: false}); if (userRole === 'content_creator') query = query.eq('author_email', userEmail); const { data: causes } = await query;")
]

for old, new in fetch_replacements:
    content = content.replace(old, new)

# 7. Update save logic in managers
save_replacements = [
    ("const savePost = async () => { if(isSupabaseConfigured() && editingPost) { setLoading(true); const { id, ...updateData } = editingPost;",
     "const savePost = async (status: string) => { if(isSupabaseConfigured() && editingPost) { setLoading(true); const { id, ...updateData } = editingPost; updateData.approval_status = status; updateData.author_email = userEmail;"),
    ("const saveAlbum = async () => { if(isSupabaseConfigured() && editingAlbum) { setLoading(true); const { id, gallery_images, ...updateData } = editingAlbum;",
     "const saveAlbum = async (status: string) => { if(isSupabaseConfigured() && editingAlbum) { setLoading(true); const { id, gallery_images, ...updateData } = editingAlbum; updateData.approval_status = status; updateData.author_email = userEmail;"),
    ("const saveMember = async () => { if(isSupabaseConfigured() && editingMember) { setLoading(true); const { id, ...updateData } = editingMember;",
     "const saveMember = async (status: string) => { if(isSupabaseConfigured() && editingMember) { setLoading(true); const { id, ...updateData } = editingMember; updateData.approval_status = status; updateData.author_email = userEmail;"),
    ("const saveTestimonial = async () => { if(isSupabaseConfigured() && editingTestimonial) { setLoading(true); const { id, ...updateData } = editingTestimonial;",
     "const saveTestimonial = async (status: string) => { if(isSupabaseConfigured() && editingTestimonial) { setLoading(true); const { id, ...updateData } = editingTestimonial; updateData.approval_status = status; updateData.author_email = userEmail;"),
    ("const saveStory = async () => { if(isSupabaseConfigured() && editingStory) { setLoading(true); const { id, ...updateData } = editingStory;",
     "const saveStory = async (status: string) => { if(isSupabaseConfigured() && editingStory) { setLoading(true); const { id, ...updateData } = editingStory; updateData.approval_status = status; updateData.author_email = userEmail;"),
    ("const saveGroup = async () => { if(isSupabaseConfigured() && editingGroup) { setLoading(true); const { id, ...updateData } = editingGroup;",
     "const saveGroup = async (status: string) => { if(isSupabaseConfigured() && editingGroup) { setLoading(true); const { id, ...updateData } = editingGroup; updateData.approval_status = status; updateData.author_email = userEmail;"),
    ("const saveCause = async () => { if(isSupabaseConfigured() && editingCause) { setLoading(true); const { id, ...updateData } = editingCause;",
     "const saveCause = async (status: string) => { if(isSupabaseConfigured() && editingCause) { setLoading(true); const { id, ...updateData } = editingCause; updateData.approval_status = status; updateData.author_email = userEmail;")
]

for old, new in save_replacements:
    content = content.replace(old, new)

# 8. Replace save buttons with ApprovalControls
button_replacements = [
    ('<button onClick={savePost} disabled={loading} className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">{loading ? "Saving..." : "Save Post"}</button>',
     '<ApprovalControls item={editingPost} setItem={setEditingPost} onSave={savePost} loading={loading} userRole={userRole} userEmail={userEmail} />'),
    ('<button onClick={saveAlbum} disabled={loading} className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">{loading ? "Saving..." : "Save Album"}</button>',
     '<ApprovalControls item={editingAlbum} setItem={setEditingAlbum} onSave={saveAlbum} loading={loading} userRole={userRole} userEmail={userEmail} />'),
    ('<button onClick={saveMember} disabled={loading} className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">{loading ? "Saving..." : "Save Member"}</button>',
     '<ApprovalControls item={editingMember} setItem={setEditingMember} onSave={saveMember} loading={loading} userRole={userRole} userEmail={userEmail} />'),
    ('<button onClick={saveTestimonial} disabled={loading} className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">{loading ? "Saving..." : "Save Testimonial"}</button>',
     '<ApprovalControls item={editingTestimonial} setItem={setEditingTestimonial} onSave={saveTestimonial} loading={loading} userRole={userRole} userEmail={userEmail} />'),
    ('<button onClick={saveStory} disabled={loading} className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">{loading ? "Saving..." : "Save Story"}</button>',
     '<ApprovalControls item={editingStory} setItem={setEditingStory} onSave={saveStory} loading={loading} userRole={userRole} userEmail={userEmail} />'),
    ('<button onClick={saveGroup} disabled={loading} className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">{loading ? "Saving..." : "Save Group"}</button>',
     '<ApprovalControls item={editingGroup} setItem={setEditingGroup} onSave={saveGroup} loading={loading} userRole={userRole} userEmail={userEmail} />'),
    ('<button onClick={saveCause} disabled={loading} className="w-full bg-brand-blue text-white py-3 rounded-lg font-bold">{loading ? "Saving..." : "Save Cause"}</button>',
     '<ApprovalControls item={editingCause} setItem={setEditingCause} onSave={saveCause} loading={loading} userRole={userRole} userEmail={userEmail} />')
]

for old, new in button_replacements:
    content = content.replace(old, new)

# 9. Add status badges to list views
badge_replacements = [
    ('<h3 className="font-bold text-gray-800">{p.title}</h3>',
     '<h3 className="font-bold text-gray-800 flex items-center gap-2">{p.title} <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${p.approval_status === \'published\' ? \'bg-green-100 text-green-700\' : p.approval_status === \'pending\' ? \'bg-yellow-100 text-yellow-700\' : p.approval_status === \'rejected\' ? \'bg-red-100 text-red-700\' : \'bg-gray-100 text-gray-700\'}`}>{p.approval_status || \'published\'}</span></h3>'),
    ('<h3 className="font-bold text-gray-800">{a.title}</h3>',
     '<h3 className="font-bold text-gray-800 flex items-center gap-2">{a.title} <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${a.approval_status === \'published\' ? \'bg-green-100 text-green-700\' : a.approval_status === \'pending\' ? \'bg-yellow-100 text-yellow-700\' : a.approval_status === \'rejected\' ? \'bg-red-100 text-red-700\' : \'bg-gray-100 text-gray-700\'}`}>{a.approval_status || \'published\'}</span></h3>'),
    ('<h3 className="font-bold text-gray-800">{m.name}</h3>',
     '<h3 className="font-bold text-gray-800 flex items-center gap-2">{m.name} <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${m.approval_status === \'published\' ? \'bg-green-100 text-green-700\' : m.approval_status === \'pending\' ? \'bg-yellow-100 text-yellow-700\' : m.approval_status === \'rejected\' ? \'bg-red-100 text-red-700\' : \'bg-gray-100 text-gray-700\'}`}>{m.approval_status || \'published\'}</span></h3>'),
    ('<h3 className="font-bold text-gray-800">{t.name}</h3>',
     '<h3 className="font-bold text-gray-800 flex items-center gap-2">{t.name} <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${t.approval_status === \'published\' ? \'bg-green-100 text-green-700\' : t.approval_status === \'pending\' ? \'bg-yellow-100 text-yellow-700\' : t.approval_status === \'rejected\' ? \'bg-red-100 text-red-700\' : \'bg-gray-100 text-gray-700\'}`}>{t.approval_status || \'published\'}</span></h3>'),
    ('<h3 className="font-bold text-gray-800">{s.title}</h3>',
     '<h3 className="font-bold text-gray-800 flex items-center gap-2">{s.title} <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${s.approval_status === \'published\' ? \'bg-green-100 text-green-700\' : s.approval_status === \'pending\' ? \'bg-yellow-100 text-yellow-700\' : s.approval_status === \'rejected\' ? \'bg-red-100 text-red-700\' : \'bg-gray-100 text-gray-700\'}`}>{s.approval_status || \'published\'}</span></h3>'),
    ('<h3 className="font-bold text-gray-800">{g.name}</h3>',
     '<h3 className="font-bold text-gray-800 flex items-center gap-2">{g.name} <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${g.approval_status === \'published\' ? \'bg-green-100 text-green-700\' : g.approval_status === \'pending\' ? \'bg-yellow-100 text-yellow-700\' : g.approval_status === \'rejected\' ? \'bg-red-100 text-red-700\' : \'bg-gray-100 text-gray-700\'}`}>{g.approval_status || \'published\'}</span></h3>'),
    ('<h3 className="font-bold text-gray-800">{c.title}</h3>',
     '<h3 className="font-bold text-gray-800 flex items-center gap-2">{c.title} <span className={`text-[10px] px-2 py-0.5 rounded uppercase ${c.approval_status === \'published\' ? \'bg-green-100 text-green-700\' : c.approval_status === \'pending\' ? \'bg-yellow-100 text-yellow-700\' : c.approval_status === \'rejected\' ? \'bg-red-100 text-red-700\' : \'bg-gray-100 text-gray-700\'}`}>{c.approval_status || \'published\'}</span></h3>')
]

for old, new in badge_replacements:
    content = content.replace(old, new)

# 10. Update GENERATED_SQL RLS policies
rls_replacements = [
    ("create policy \"Public read blog\" on public.blog_posts for select using (true);",
     "create policy \"Public read blog\" on public.blog_posts for select using (approval_status = 'published' OR approval_status IS NULL);"),
    ("create policy \"Public read impact stories\" on public.impact_stories for select using (true);",
     "create policy \"Public read impact stories\" on public.impact_stories for select using (approval_status = 'published' OR approval_status IS NULL);"),
    ("create policy \"Public read gallery albums\" on public.gallery_albums for select using (true);",
     "create policy \"Public read gallery albums\" on public.gallery_albums for select using (approval_status = 'published' OR approval_status IS NULL);"),
    ("create policy \"Public read team members\" on public.team_members for select using (true);",
     "create policy \"Public read team members\" on public.team_members for select using (approval_status = 'published' OR approval_status IS NULL);"),
    ("create policy \"Public read testimonials\" on public.testimonials for select using (true);",
     "create policy \"Public read testimonials\" on public.testimonials for select using (approval_status = 'published' OR approval_status IS NULL);"),
    ("create policy \"Public read mission groups\" on public.mission_groups for select using (true);",
     "create policy \"Public read mission groups\" on public.mission_groups for select using (approval_status = 'published' OR approval_status IS NULL);"),
    ("create policy \"Public read mission causes\" on public.mission_causes for select using (true);",
     "create policy \"Public read mission causes\" on public.mission_causes for select using (approval_status = 'published' OR approval_status IS NULL);")
]

for old, new in rls_replacements:
    content = content.replace(old, new)

# 11. Add migration SQL
migration_sql = """
  -- Approval Workflow Columns
  declare
    t text;
    tables text[] := array['blog_posts', 'impact_stories', 'testimonials', 'team_members', 'gallery_albums', 'impact_stats', 'mission_causes', 'mission_groups'];
  begin
    foreach t in array tables
    loop
      execute format('alter table public.%I add column if not exists approval_status text default ''published''', t);
      execute format('alter table public.%I add column if not exists reviewer_comments text', t);
      execute format('alter table public.%I add column if not exists author_email text', t);
    end loop;
  end;
"""

content = content.replace(
    "-- Partnership Inquiries Status",
    migration_sql + "\n  -- Partnership Inquiries Status"
)

# 12. Add option to AdminUsersManager
content = content.replace(
    '<option value="volunteer_manager">Volunteer Manager</option>',
    '<option value="volunteer_manager">Volunteer Manager</option><option value="content_creator">Content Creator</option>'
)

with open('pages/AdminPages.tsx', 'w') as f:
    f.write(content)

print("Done updating AdminPages.tsx")
