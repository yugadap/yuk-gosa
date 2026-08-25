const crypto = require('crypto');

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { name = '', answers } = request.body || {};
  if (!Array.isArray(answers) || answers.length === 0) {
    return response.status(400).json({ error: 'Answers are required' });
  }

  const id = crypto.randomBytes(5).toString('base64url');

  const supabaseResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/gosa_results_s3`, {
    method: 'POST',
    headers: {
      apikey: process.env.SUPABASE_SECRET_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({ id, name, answers })
  });

  if (!supabaseResponse.ok) {
    return response.status(502).json({ error: 'Could not save result' });
  }

  return response.status(200).json({ id });
};
