# MailerLite Setup (No Netlify Function)

Goal: visitor enters email in popup -> MailerLite sends beautiful voucher email with `DIRECT10`.

## 1) Form
- In MailerLite, open form id `VklMpT`.
- Set form to collect only `email`.
- Success message suggestion: `Your private 10% voucher is on its way.`

## 2) Automation
- Create automation: `Voucher Direct10`.
- Trigger: `When subscriber joins form/group linked to VklMpT`.
- Add email step immediately.

## 3) Email settings
- Subject: `Your private 10% Jungle Loft voucher`
- Preview text: `DIRECT10 is ready — see you in Galle.`
- From name: `The Jungle Loft`
- From email: `jungleloftgalle@gmail.com` (or your verified domain email)

## 4) Email body (pro template from repo)

- Use this file as source: `email/voucher-direct10.html`
- Open it and paste the full HTML into a MailerLite HTML block.

## 5) Quick settings for premium output

- Keep width at 680px.
- Keep both image URLs absolute (`https://thejungleloftgalle.com/...`).
- Test dark mode in Gmail/Apple Mail.

## 6) Publish
- Activate automation.
- Test with your own email.
- Confirm delivery + design in Gmail and Apple Mail.
