// 공급처 잔액 조회 — API 키는 서버 환경변수에 숨긴다(프론트에 절대 노출 안 됨).
// Vercel 서버리스 함수. 잔액은 "충전 관리용" — 전 공급처 조회하되 실제 충전은 주력만(테리).
const PROVIDERS = {
  'Stream-Promotion': { url: 'https://stream-promotion.com/api/v2', key: process.env.SP_KEY },
  'SMB Panel':        { url: 'https://smbpanel.net/api/v2',         key: process.env.SMB_KEY },
  'RealSite':         { url: 'https://realsite.shop/api/v2',        key: process.env.REAL_KEY },
  'smmwiz':           { url: 'https://smmwiz.com/api/v2',           key: process.env.SMMWIZ_KEY },
  'major':            { url: 'https://majorpanel.com/api/v2',       key: process.env.MAJOR_KEY },
  'rezz':             { url: 'https://rezzsmmpanel.com/api/v2',     key: process.env.REZZ_KEY },
  'JAP':              { url: 'https://justanotherpanel.com/api/v2', key: process.env.JAP_KEY },
  'morethan':         { url: 'https://morethanpanel.com/api/v2',    key: process.env.MORETHAN_KEY },
  'n1panel':          { url: 'https://n1panel.com/api/v2',          key: process.env.N1PANEL_KEY },
  'Peakerr':          { url: 'https://peakerr.com/api/v2',          key: process.env.PEAKERR_KEY },
  'pacysmm':          { url: 'https://pacysmm.com/api/v1',          key: process.env.PACYSMM_KEY },
  'SMMVALY':          { url: 'https://smmvaly.com/api/v2',          key: process.env.SMMVALY_KEY },
  'allsmm':           { url: 'https://allsmm.net/api/v2',           key: process.env.ALLSMM_KEY },
};

async function one(name, p) {
  try {
    if (!p.key) return [name, { error: '키 미설정(환경변수 확인)' }];
    const r = await fetch(p.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key: p.key, action: 'balance' }),
      signal: AbortSignal.timeout(9000),
    });
    return [name, await r.json()];   // { balance, currency } (pacysmm v1은 status 필드 추가, balance 동일)
  } catch (e) { return [name, { error: String(e && e.message || e) }]; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  const pairs = await Promise.all(Object.entries(PROVIDERS).map(([n, p]) => one(n, p)));
  const out = Object.fromEntries(pairs);
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
  res.status(200).json(out);
}
