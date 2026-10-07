// Vercel serverless function: POST /api/waitlist
// No database required — validates the email and returns success.
// Connect a store (e.g. Vercel KV, Postgres, or an email provider) later;
// for pre-launch review this simply acknowledges the signup honestly.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

module.exports = async function handler(req, res) {
  // CORS for static frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email = String((body && body.email) || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 254) {
    res.status(400).json({ error: 'Please enter a valid email address.' });
    return;
  }
  // TODO: persist `email` to your store / email provider when ready.
  console.log('Waitlist signup:', email);
  res.status(200).json({ ok: true, message: 'Thanks — you are on the waitlist.' });
};
