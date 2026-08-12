import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'sreerampillai158@gmail.com',
    password: 'password123' // I don't know the password
  });
  console.log("Auth:", data.session ? "Success" : "Failed");
}
check();
