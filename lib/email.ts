import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "KadeStore <noreply@kadestore.com>";

function baseTemplate(content: string) {
  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f8f9fa;margin:0;padding:24px}
  .card{background:#fff;border-radius:16px;max-width:560px;margin:0 auto;overflow:hidden;box-shadow:0 1px 8px rgba(0,0,0,.06)}
  .header{background:#f59e0b;padding:28px 32px;text-align:center}
  .header h1{color:#fff;margin:0;font-size:22px;font-weight:800;letter-spacing:-.5px}
  .header span{color:rgba(255,255,255,.8);font-size:13px}
  .body{padding:32px}
  .key-box{background:#f8f9fa;border:2px dashed #e5e7eb;border-radius:12px;padding:16px;text-align:center;margin:20px 0}
  .key{font-family:monospace;font-size:20px;font-weight:700;color:#111;letter-spacing:.12em}
  .btn{display:inline-block;background:#f59e0b;color:#fff;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;margin-top:16px}
  .footer{text-align:center;padding:16px 32px 24px;color:#9ca3af;font-size:12px}
  .tag{display:inline-block;background:#f3f4f6;color:#6b7280;padding:3px 10px;border-radius:20px;font-size:12px;margin:2px}
</style></head>
<body>${content}</body></html>`;
}

export async function sendOrderConfirmation(opts: {
  to: string;
  name: string;
  gameTitle: string;
  platform: string;
  key: string;
  price: number;
  orderId: string;
}) {
  const html = baseTemplate(`
<div class="card">
  <div class="header">
    <h1>● KadeStore</h1>
    <span>Sipariş Onayı</span>
  </div>
  <div class="body">
    <p style="color:#374151;margin-top:0">Merhaba <strong>${opts.name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px">Satın alma işleminiz tamamlandı. Oyun anahtarınız aşağıda:</p>
    <div class="key-box">
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:.05em">Oyun Anahtarı</p>
      <p class="key">${opts.key}</p>
    </div>
    <p style="font-size:14px;color:#374151;margin:0 0 4px"><strong>${opts.gameTitle}</strong></p>
    <div style="margin-bottom:20px">
      <span class="tag">${opts.platform}</span>
      <span class="tag">₺${opts.price.toFixed(2)}</span>
      <span class="tag">Sipariş #${opts.orderId.slice(-8).toUpperCase()}</span>
    </div>
    <p style="font-size:13px;color:#9ca3af">Anahtarı doğrulamak için:</p>
    <a href="${process.env.NEXTAUTH_URL}/verify" class="btn">Anahtarı Doğrula →</a>
  </div>
  <div class="footer">
    Bu e-posta KadeStore tarafından gönderilmiştir.<br>
    Sorularınız için <a href="${process.env.NEXTAUTH_URL}" style="color:#f59e0b">kadestore.com</a> adresini ziyaret edin.
  </div>
</div>`);

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `✅ Oyun Anahtarınız: ${opts.gameTitle} — KadeStore`,
    html,
  });
}

export async function sendWelcomeEmail(opts: { to: string; name: string }) {
  const html = baseTemplate(`
<div class="card">
  <div class="header">
    <h1>● KadeStore</h1>
    <span>Hoş Geldiniz!</span>
  </div>
  <div class="body">
    <p style="color:#374151;margin-top:0">Merhaba <strong>${opts.name}</strong>!</p>
    <p style="color:#6b7280;font-size:14px">KadeStore'a katıldığınız için teşekkürler. Dijital oyun dünyasında en iyi adrestesiniz.</p>
    <ul style="color:#6b7280;font-size:14px;padding-left:20px">
      <li>500+ oyun çeşidi</li>
      <li>Anında anahtar teslimatı</li>
      <li>Rank sistemi ile ödüller</li>
      <li>Steam Guard 2FA yönetimi</li>
    </ul>
    <a href="${process.env.NEXTAUTH_URL}/games" class="btn">Oyunları Keşfet →</a>
  </div>
  <div class="footer">© 2026 KadeStore · Dijital oyun dünyasının güvenilir adresi</div>
</div>`);

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: "KadeStore'a Hoş Geldiniz! 🎮",
    html,
  });
}

export async function sendPasswordResetEmail(opts: { to: string; name: string; newPassword: string }) {
  const html = baseTemplate(`
<div class="card">
  <div class="header"><h1>● KadeStore</h1><span>Şifre Değişikliği</span></div>
  <div class="body">
    <p style="color:#374151;margin-top:0">Merhaba <strong>${opts.name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px">Şifreniz başarıyla değiştirildi.</p>
    <div class="key-box"><p style="margin:0;font-size:13px;color:#374151">Bu değişikliği siz yapmadıysanız hemen destek ekibimizle iletişime geçin.</p></div>
    <a href="${process.env.NEXTAUTH_URL}/login" class="btn">Giriş Yap →</a>
  </div>
  <div class="footer">© 2026 KadeStore</div>
</div>`);

  await transporter.sendMail({ from: FROM, to: opts.to, subject: "Şifreniz Değiştirildi — KadeStore", html });
}

export async function sendLowStockAlert(opts: {
  to: string;
  games: { title: string; available: number }[];
}) {
  const rows = opts.games.map(g =>
    `<tr><td style="padding:8px 12px;border-bottom:1px solid #f3f4f6">${g.title}</td>
     <td style="padding:8px 12px;border-bottom:1px solid #f3f4f6;color:${g.available === 0 ? "#ef4444" : "#f59e0b"};font-weight:700;text-align:right">
       ${g.available === 0 ? "STOK YOK" : g.available + " adet"}
     </td></tr>`
  ).join("");

  const html = baseTemplate(`
<div class="card">
  <div class="header" style="background:#ef4444"><h1>⚠️ KadeStore Admin</h1><span>Düşük Stok Uyarısı</span></div>
  <div class="body">
    <p style="color:#374151;margin-top:0">Aşağıdaki oyunların stok seviyesi kritik düzeyde:</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px">${rows}</table>
    <a href="${process.env.NEXTAUTH_URL}/admin/stock" class="btn" style="background:#ef4444">Stok Paneline Git →</a>
  </div>
  <div class="footer">© 2026 KadeStore Admin Bildirim Sistemi</div>
</div>`);

  await transporter.sendMail({ from: FROM, to: opts.to, subject: `⚠️ Düşük Stok Uyarısı (${opts.games.length} oyun) — KadeStore`, html });
}

export async function sendCouponEmail(opts: { to: string; name: string; code: string; value: number; type: string }) {
  const discount = opts.type === "percent" ? `%${opts.value}` : `₺${opts.value}`;
  const html = baseTemplate(`
<div class="card">
  <div class="header"><h1>● KadeStore</h1><span>Özel İndirim Kuponu</span></div>
  <div class="body">
    <p style="color:#374151;margin-top:0">Merhaba <strong>${opts.name}</strong>,</p>
    <p style="color:#6b7280;font-size:14px">Size özel <strong>${discount} indirim kuponu</strong> kazandınız!</p>
    <div class="key-box">
      <p style="margin:0 0 8px;font-size:12px;color:#9ca3af">KUPON KODUNUZ</p>
      <p class="key" style="color:#f59e0b">${opts.code}</p>
      <p style="margin:8px 0 0;font-size:12px;color:#6b7280">${discount} indirim</p>
    </div>
    <a href="${process.env.NEXTAUTH_URL}/games" class="btn">Alışverişe Başla →</a>
  </div>
  <div class="footer">© 2026 KadeStore</div>
</div>`);

  await transporter.sendMail({ from: FROM, to: opts.to, subject: `🎁 ${discount} İndirim Kuponunuz — KadeStore`, html });
}

export async function testSmtp(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch {
    return false;
  }
}
