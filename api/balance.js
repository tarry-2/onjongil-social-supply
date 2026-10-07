// 공급처 잔액 조회 — API 키는 서버 환경변수에 숨긴다(프론트에 절대 노출 안 됨).
// Vercel 서버리스 함수. 환경변수: SP_KEY(Stream-Promotion), SMB_KEY(SMB Panel).
const PROVIDERS = {
  'Stream-Promotion': { url: 'https://stream-promotion.com/api/v2', key: process.env.SP_KEY },
  'SMB Panel':        { url: 'https://smbpanel.net/api/v2',        key: process.env.SMB_KEY },
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const out = {};
  for (const [name, p] of Object.entries(PROVIDERS)) {
    try {
      if (!p.key) { out[name] = { error: '키 미설정(환경변수 확인)' }; continue; }
      const r = await fetch(p.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ key: p.key, action: 'balance' }),
      });
      out[name] = await r.json();   // { balance, currency }
    } catch (e) {
      out[name] = { error: String(e && e.message || e) };
    }
  }
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  res.status(200).json(out);
}
