# Voucher System (No MailerLite)

The website now uses a custom premium popup + direct form delivery via FormSubmit.

## What is live in code
- Popup form is custom HTML/CSS/JS in `index.html`.
- Endpoint: `https://formsubmit.co/ajax/jungleloftgalle@gmail.com`
- Voucher code: `DIRECT10`
- Success state: inline luxury success card + copy-code button.

## FormSubmit behavior
- Sends submission to `jungleloftgalle@gmail.com`.
- Sends autoresponse to the guest email with voucher text.
- Honeypot field is included for basic bot filtering.

## First-time activation (required once)
1. Open the website and submit your own email in the popup once.
2. FormSubmit sends an activation message to `jungleloftgalle@gmail.com`.
3. Click activation link in that email.
4. Submit again to confirm live delivery.

## Optional upgrade path
If you want fully branded HTML voucher emails (with hero images) as the actual autoresponse,
connect a transactional provider (Resend/Brevo/Postmark) via a tiny serverless endpoint.
The frontend popup can stay exactly as-is.
