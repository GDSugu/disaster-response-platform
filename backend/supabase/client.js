const { createClient } = require('@supabase/supabase-js');

// Debug: confirm env variables are loaded
console.log('🔍 SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('🔍 SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = supabase;
