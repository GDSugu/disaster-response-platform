const supabase = require('../supabase/client');

exports.cacheFetch = async (key) => {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from('cache')
    .select('value')
    .eq('key', key)
    .gte('expires_at', now)
    .maybeSingle();

  if (error || !data) return null;
  return data.value;
};
