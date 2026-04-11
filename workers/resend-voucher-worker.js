export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': 'https://thejungleloftgalle.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    try {
      const { email, lang = 'en', voucherCode = 'DIRECT10', source = 'website' } = await request.json();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return new Response(JSON.stringify({ ok: false, error: 'Invalid email' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      const code = voucherCode || 'DIRECT10';
      const subject = lang === 'de'
        ? 'Ihr privater 10% Welcome Code für The Jungle Loft'
        : lang === 'ru'
        ? 'Ваш персональный код 10% для The Jungle Loft'
        : 'Your private 10% code for The Jungle Loft';

      const text = `Hi and thank you for your interest in The Jungle Loft.\n\nYour private direct-booking voucher code is: ${code}\n\nWarm regards,\nThe Jungle Loft Team\nGalle, Sri Lanka`;

      const html = buildVoucherHtml({ code, lang });

      const toGuest = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM,
          to: [email],
          subject,
          text,
          html
        })
      });

      if (!toGuest.ok) {
        const err = await toGuest.text();
        return new Response(JSON.stringify({ ok: false, error: 'Guest email failed', details: err }), {
          status: 502,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Internal notification
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: env.RESEND_FROM,
          to: [env.NOTIFY_EMAIL],
          subject: `New voucher signup (${source})`,
          text: `New signup: ${email}\nSource: ${source}\nLanguage: ${lang}\nCode: ${code}`
        })
      });

      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, error: String(error) }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }
  }
};

function buildVoucherHtml({ code, lang }) {
  const copy = getCopy(lang, code);
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3efe5;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3efe5;padding:28px 10px;font-family:Arial,sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="max-width:680px;width:100%;background:#ffffff;border:1px solid #e7decb;border-radius:18px;overflow:hidden;">
            <tr>
              <td><img src="https://thejungleloftgalle.com/assets/offer.jpg" alt="The Jungle Loft" width="680" style="display:block;width:100%;height:auto;"></td>
            </tr>
            <tr>
              <td style="padding:30px 30px 18px;color:#14261e;">
                <p style="margin:0 0 8px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#5f7367;">Private Guest Offer</p>
                <h1 style="margin:0 0 12px;font-family:Georgia,serif;font-size:36px;line-height:1.08;font-weight:500;color:#10271d;">${copy.title}</h1>
                <p style="margin:0 0 16px;font-size:17px;line-height:1.6;color:#2e4438;">${copy.intro}</p>
                <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tr><td style="background:#edf4ef;border:1px solid #c8d8cd;border-radius:12px;padding:12px 18px;"><span style="font-size:34px;letter-spacing:.08em;font-weight:700;color:#0e4f33;">${code}</span></td></tr></table>
                <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#3c5247;">${copy.body}</p>
                <a href="https://thejungleloftgalle.com/#availability" style="display:inline-block;background:#0e4f33;color:#ffffff;text-decoration:none;padding:13px 24px;border-radius:999px;font-size:14px;font-weight:700;">${copy.cta}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:0 30px 8px;"><img src="https://thejungleloftgalle.com/assets/place.jpg" alt="Jungle atmosphere" width="620" style="display:block;width:100%;height:auto;border-radius:12px;"></td>
            </tr>
            <tr>
              <td style="padding:12px 30px 30px;color:#5d6f64;font-size:13px;line-height:1.6;">${copy.signoff}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function getCopy(lang, code) {
  if (lang === 'de') {
    return {
      title: 'Ihr 10% Welcome-Voucher',
      intro: 'Vielen Dank für Ihr Interesse am The Jungle Loft. Wir freuen uns sehr, Sie in unserem kleinen Luxury Hideaway in Galle willkommen zu heißen.',
      body: `Ihr privater Direktbuchungs-Code lautet: <strong>${code}</strong>. Nutzen Sie ihn für Ihre direkte Buchung über unsere Website.`,
      cta: 'Verfügbarkeit prüfen',
      signoff: 'Herzliche Grüße,<br>The Jungle Loft Team<br>Galle, Sri Lanka'
    };
  }
  if (lang === 'ru') {
    return {
      title: 'Ваш приветственный ваучер 10%',
      intro: 'Спасибо за интерес к The Jungle Loft. Будем рады приветствовать вас в нашем камерном luxury-отеле в Галле.',
      body: `Ваш персональный код для прямого бронирования: <strong>${code}</strong>. Используйте его при бронировании через наш официальный сайт.`,
      cta: 'Проверить наличие',
      signoff: 'С теплом,<br>The Jungle Loft Team<br>Galle, Sri Lanka'
    };
  }
  return {
    title: 'Your 10% Welcome Voucher',
    intro: 'Thank you for your interest in The Jungle Loft. We would be delighted to host you in our intimate luxury jungle retreat in Galle.',
    body: `Your private direct-booking code is: <strong>${code}</strong>. Use it when booking directly through our official website.`,
    cta: 'Check availability',
    signoff: 'Warm regards,<br>The Jungle Loft Team<br>Galle, Sri Lanka'
  };
}
