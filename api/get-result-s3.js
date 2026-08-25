module.exports = async function handler(request, response) {
  const id = String(request.query?.id || '');
  if (!id || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) {
    return response.status(400).json({ error: 'Invalid result id' });
  }

  const url = `${process.env.SUPABASE_URL}/rest/v1/gosa_results_s3?id=eq.${encodeURIComponent(id)}&select=name,answers`;
  const supabaseResponse = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`
    }
  });

  if (!supabaseResponse.ok) {
    return response.status(502).json({ error: 'Could not load result' });
  }
  const rows = await supabaseResponse.json();
  if (!rows.length) return response.status(404).json({ error: 'Result not found' });
  return response.status(200).json(rows[0]);
};
