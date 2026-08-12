const fs = require('fs');
let content = fs.readFileSync('lib/supabaseClient.ts', 'utf8');

content = content.replace(
    "export const supabase = createClient(\n    SUPABASE_URL || 'https://placeholder.supabase.co', \n    SUPABASE_ANON_KEY || 'placeholder'\n);",
    "export const supabase = createClient(\n    SUPABASE_URL || 'https://placeholder.supabase.co', \n    SUPABASE_ANON_KEY || 'placeholder',\n    {\n        auth: {\n            storageKey: 'bennu_auth_token_v2',\n            autoRefreshToken: true,\n            persistSession: true,\n            detectSessionInUrl: false\n        }\n    }\n);"
);

fs.writeFileSync('lib/supabaseClient.ts', content);
