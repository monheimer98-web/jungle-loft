# Voucher System: Premium Resend Setup

This project now supports a professional voucher mail flow with custom popup + branded HTML email.

## Current behavior
- Website popup is fully custom (no MailerLite).
- Frontend currently uses fallback endpoint (`formsubmit.co`) unless you set a secure API endpoint.
- Ready-to-deploy Resend Worker file exists at:
  - `workers/resend-voucher-worker.js`

## What you need
- Resend account
- Verified sender/domain in Resend
- Cloudflare account (free Worker)

## 1) Deploy the Worker (Cloudflare)
1. Install Wrangler locally (or use Cloudflare dashboard):
   - `npm i -g wrangler`
2. In any folder, create `wrangler.toml` and point to the worker file.
3. Set secrets:
   - `RESEND_API_KEY`
4. Set vars:
   - `RESEND_FROM` (e.g. `The Jungle Loft <hello@thejungleloftgalle.com>`)
   - `NOTIFY_EMAIL` (e.g. `jungleloftgalle@gmail.com`)
5. Deploy worker and copy final URL, e.g.:
   - `https://jungleloft-voucher.yourname.workers.dev`

## 2) Connect website to Worker
In `index.html`, set endpoint before the app script runs:
```html
<script>
  window.VOUCHER_API_ENDPOINT = 'https://YOUR-WORKER-URL.workers.dev';
</script>
```
The frontend sends JSON to this URL and the worker sends:
- Branded HTML voucher email to guest
- Internal notification email to your inbox

## 3) Test flow
1. Open website popup
2. Submit test email
3. Confirm:
   - Success card appears + DIRECT10 copy button
   - Guest receives styled HTML email
   - Internal inbox gets signup notification

## Notes
- Keep the fallback endpoint only until Worker is live.
- After Worker is live, remove fallback if you want strict Resend-only flow.
