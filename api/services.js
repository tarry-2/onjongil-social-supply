// 두 공급처의 최신 상품을 실시간으로 받아 한국어로 변환해 반환.
// 원청(공급처)이 새 상품을 올리면 '상품 동기화'로 즉시 최신 목록을 가져온다. 키는 환경변수로 숨김.
import { transform, metaOf } from './_convert.js';

const SOURCES = [
  ['https://stream-promotion.com/api/v2', process.env.SP_KEY,   'Stream-Promotion'],
  ['https://smbpanel.net/api/v2',         process.env.SMB_KEY,  'SMB Panel'],
  ['https://realsite.shop/api/v2',        process.env.REAL_KEY, 'RealSite'],
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }

  let out = [];
  const errors = {};
  for (const [url, key, name] of SOURCES) {
    if (!key) { errors[name] = '키 미설정(환경변수 확인)'; continue; }
    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ key, action: 'services' }),
      });
      const list = await r.json();
      if (Array.isArray(list)) out = out.concat(transform(list, name));
      else errors[name] = (list && list.error) || '응답 형식 오류';
    } catch (e) { errors[name] = String(e && e.message || e); }
  }

  // 공급처 API는 자주 안 바뀌므로 5분 캐시(그 사이 '동기화' 눌러도 빠름).
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
  res.status(200).json({ catalog: out, meta: metaOf(out), errors, syncedAt: new Date().toISOString() });
}
