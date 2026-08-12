import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const email = 'test_admin_' + Date.now() + '@gmail.com';
  const password = 'password123';
  
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (authError) {
    console.log("Auth error:", authError.message);
    return;
  }
  
  console.log("User created:", authData.user?.id);
  
  const { data: postData, error: postError } = await supabase.from('blog_posts').delete().eq('id', 999999).select();
  console.log("Delete post result:", postData, postError);
}
test();
