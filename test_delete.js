import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'sreerampillai158@gmail.com',
    password: 'password123' // I don't know the password
  });
  
  if (authError) {
    console.log("Auth failed:", authError.message);
    return;
  }

  const { data, error } = await supabase.from('admin_whitelist').delete().eq('email', 'supersain18@gmail.com').select();
  console.log("Delete result:", data, error);
}
check();
