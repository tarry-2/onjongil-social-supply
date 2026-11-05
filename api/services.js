// 전 공급처의 최신 상품을 실시간으로 받아 한국어로 변환해 반환.
// 원청(공급처)이 새 상품을 올리면 '상품 동기화'로 즉시 최신 목록을 가져온다. 키는 환경변수로 숨김.
// "최대한 다양하게, 없는 게 없게" — 연동은 자동이라 공급처가 많아도 관리 부담 없음(테리 2026-11-05).
import { transform, metaOf } from './_convert.js';

// [API URL, 환경변수 키, 표시이름]. pacysmm만 /api/v1, 나머지 표준 /api/v2.
const SOURCES = [
  ['https://stream-promotion.com/api/v2', process.env.SP_KEY,       'Stream-Promotion'],
  ['https://smbpanel.net/api/v2',         process.env.SMB_KEY,      'SMB Panel'],
  ['https://realsite.shop/api/v2',        process.env.REAL_KEY,     'RealSite'],
  ['https://smmwiz.com/api/v2',           process.env.SMMWIZ_KEY,   'smmwiz'],
  ['https://majorpanel.com/api/v2',       process.env.MAJOR_KEY,    'major'],
  ['https://rezzsmmpanel.com/api/v2',     process.env.REZZ_KEY,     'rezz'],
  ['https://justanotherpanel.com/api/v2', process.env.JAP_KEY,      'JAP'],
  ['https://morethanpanel.com/api/v2',    process.env.MORETHAN_KEY, 'morethan'],
  ['https://n1panel.com/api/v2',          process.env.N1PANEL_KEY,  'n1panel'],
  ['https://peakerr.com/api/v2',          process.env.PEAKERR_KEY,  'Peakerr'],
  ['https://pacysmm.com/api/v1',          process.env.PACYSMM_KEY,  'pacysmm'],
  ['https://smmvaly.com/api/v2',          process.env.SMMVALY_KEY,  'SMMVALY'],
  ['https://allsmm.net/api/v2',           process.env.ALLSMM_KEY,   'allsmm'],
];

async function fetchOne(url, key, name) {
  if (!key) return { name, err: '키 미설정(환경변수 확인)' };
  try {
    const ctl = AbortSignal.timeout(9000);
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ key, action: 'services' }),
      signal: ctl,
    });
    const list = await r.json();
    if (Array.isArray(list)) return { name, items: transform(list, name) };
    return { name, err: (list && list.error) || '응답 형식 오류' };
  } catch (e) { return { name, err: String(e && e.message || e) }; }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  // 공급처 전부 병렬 호출(순차면 13곳에서 타임아웃 → Promise.all로 빠르게).
  const results = await Promise.all(SOURCES.map(([url, key, name]) => fetchOne(url, key, name)));
  let out = [];
  const errors = {};
  for (const r of results) {
    if (r.items) out = out.concat(r.items);
    else errors[r.name] = r.err;
  }

  // 공급처 API는 자주 안 바뀌므로 5분 캐시(그 사이 '동기화' 눌러도 빠름).
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).json({ catalog: out, meta: metaOf(out), errors, syncedAt: new Date().toISOString() });
}
