// Vercel serverless function: POST /api/request-access
// Receives the request-access form and emails it to MAIL_TO through Resend (https://resend.com).
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  required, from resend.com (the sending domain must be verified there)
//   MAIL_TO         optional, default request@cytogent.com
//   MAIL_FROM       optional, default "Cytogent website <noreply@cytogent.com>"

const TO = process.env.MAIL_TO || 'request@cytogent.com';
const FROM = process.env.MAIL_FROM || 'Cytogent website <noreply@cytogent.com>';

// Every field the form can send, per request type, in display order. Anything else is ignored.
const FORMS = {
  individual: {
    title: 'Individual',
    emailField: 'ind-email',
    nameField: 'ind-name',
    orgField: 'ind-inst',
    fields: [
      ['ind-name', 'Full name', true],
      ['ind-email', 'Work email', true],
      ['ind-inst', 'Institution', true],
      ['ind-role', 'Role', true],
      ['ind-areas', 'Fields'],
      ['ind-orcid', 'ORCID'],
      ['ind-heard', 'How did you hear about us?', true],
      ['ind-use', 'Intended use', true],
    ],
  },
  institute: {
    title: 'Institute',
    emailField: 'org-email',
    nameField: 'org-contact',
    orgField: 'org-name',
    fields: [
      ['org-name', 'Organization name', true],
      ['org-type', 'Type', true],
      ['org-country', 'Country', true],
      ['org-web', 'Website', true],
      ['org-contact', 'Contact name', true],
      ['org-email', 'Work email', true],
      ['org-role', 'Role', true],
      ['org-size', 'Team size', true],
      ['org-areas', 'Fields'],
      ['org-use', 'Intended use', true],
      ['org-compliance', 'Compliance needs'],
    ],
  },
  hospital: {
    title: 'Hospital',
    emailField: 'hos-email',
    nameField: 'hos-contact',
    orgField: 'hos-name',
    fields: [
      ['hos-name', 'Hospital name', true],
      ['hos-dept', 'Department or unit', true],
      ['hos-country', 'Country', true],
      ['hos-web', 'Website'],
      ['hos-contact', 'Contact name', true],
      ['hos-email', 'Work email', true],
      ['hos-role', 'Role', true],
      ['hos-size', 'Team size', true],
      ['hos-data', 'Patient data involved', true],
      ['hos-ethics', 'Ethics approval', true],
      ['hos-areas', 'Fields'],
      ['hos-use', 'Intended use', true],
      ['hos-compliance', 'Compliance needs'],
    ],
  },
};

const MAX_LEN = 5000;
const EMAIL_RE = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clean = (v) => String(v == null ? '' : v).replace(/\r\n?/g, '\n').trim().slice(0, MAX_LEN);
const oneLine = (s) => s.replace(/[\r\n]+/g, ' ');

function normalise(value) {
  if (Array.isArray(value)) { return value.map(clean).filter(Boolean).slice(0, 30); }
  return clean(value);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body || typeof body !== 'object') { return res.status(400).json({ ok: false, error: 'Invalid request.' }); }

  // Spam traps: a hidden field people never fill in, and a minimum time on the page.
  if (clean(body.website) || (Number(body.elapsed) > 0 && Number(body.elapsed) < 2500)) {
    return res.status(200).json({ ok: true });
  }

  const form = FORMS[body.type];
  if (!form) { return res.status(400).json({ ok: false, error: 'Choose a request type.' }); }
  if (body.consent !== true) { return res.status(400).json({ ok: false, error: 'Please agree to the Terms and the Privacy Policy.' }); }

  const input = body.fields && typeof body.fields === 'object' ? body.fields : {};
  const rows = [];
  for (const [name, label, required] of form.fields) {
    const value = normalise(input[name]);
    const empty = Array.isArray(value) ? value.length === 0 : !value;
    if (required && empty) { return res.status(400).json({ ok: false, error: `Missing field: ${label}.` }); }
    rows.push([label, value]);
  }

  const email = clean(input[form.emailField]);
  if (!EMAIL_RE.test(email)) { return res.status(400).json({ ok: false, error: 'Enter a valid email address.' }); }

  if (!process.env.RESEND_API_KEY) {
    console.error('request-access: RESEND_API_KEY is not set');
    return res.status(500).json({ ok: false, error: 'The form is not configured yet.' });
  }

  const who = oneLine(clean(input[form.nameField]));
  const org = oneLine(clean(input[form.orgField]));
  const subject = `Access request (${form.title}): ${who}${org ? ', ' + org : ''}`.slice(0, 200);
  const sent = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  const show = (v) => (Array.isArray(v) ? v.join(', ') : v) || '—';
  const text = [
    `New access request: ${form.title}`,
    `Sent ${sent}`,
    '',
    ...rows.map(([label, v]) => `${label}:\n${show(v)}\n`),
    'Consent to Terms and Privacy Policy: yes',
  ].join('\n');

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#f4f5fa;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#0B1B3A">
<div style="max-width:640px;margin:0 auto;background:#fff;border-radius:12px;padding:28px 32px">
<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#7B61FF">Access request · ${esc(form.title)}</p>
<h1 style="margin:0 0 4px;font-size:22px">${esc(who)}${org ? ' · ' + esc(org) : ''}</h1>
<p style="margin:0 0 24px;font-size:13px;color:#6b7390">Sent ${esc(sent)} from cytogent.com/request-access</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5">
${rows.map(([label, v]) => `<tr><td style="padding:10px 16px 10px 0;border-top:1px solid #e6e8f0;color:#6b7390;vertical-align:top;width:34%">${esc(label)}</td><td style="padding:10px 0;border-top:1px solid #e6e8f0;vertical-align:top;white-space:pre-wrap">${esc(show(v))}</td></tr>`).join('\n')}
<tr><td style="padding:10px 16px 10px 0;border-top:1px solid #e6e8f0;color:#6b7390">Consent</td><td style="padding:10px 0;border-top:1px solid #e6e8f0">Agreed to the Terms and the Privacy Policy</td></tr>
</table>
<p style="margin:24px 0 0;font-size:13px;color:#6b7390">Reply to this email to answer ${esc(who || 'the requester')} directly.</p>
</div></body></html>`;

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text, html }),
    });
    if (!r.ok) {
      console.error('request-access: Resend error', r.status, await r.text());
      return res.status(502).json({ ok: false, error: 'We could not send your request. Please try again.' });
    }
  } catch (err) {
    console.error('request-access: send failed', err);
    return res.status(502).json({ ok: false, error: 'We could not send your request. Please try again.' });
  }

  return res.status(200).json({ ok: true });
};
