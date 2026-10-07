// 공급처 영문 services → 한국어·플랫폼·종류·나라 변환 (convert_sp.py의 JS 포팅).
// /api/services가 두 공급처 최신 상품을 받아 이걸로 변환해 반환 → 원청 신규 상품 실시간 반영.
const USD = 1400;

const PLAT = [
  ['twitch','트위치','🟣'],['kick','킥','🟢'],['youtube','유튜브','▶️'],['telegram','텔레그램','✈️'],
  ['instagram','인스타그램','📸'],['tiktok','틱톡','🎵'],['facebook','페이스북','👍'],['spotify','스포티파이','🎧'],
  ['discord','디스코드','💬'],['threads','스레드','🧵'],['snapchat','스냅챗','👻'],['reddit','레딧','🔺'],
  ['soundcloud','사운드클라우드','☁️'],['rumble','럼블','🎬'],['likee','라이키','💛'],['trovo','트로보','🎮'],
  ['vk','브콘탁테','🔵'],['twitter','트위터','🐦'],['x ','X(트위터)','✖️'],
  ['soop','숲(아프리카)','🌲'],['afreeca','숲(아프리카)','🌲'],['naver','네이버','🟩'],['kakao','카카오','💛'],
  ['chzzk','치지직','🟢'],['band','밴드','🟩'],['shopee','쇼피','🛒'],['lazada','라자다','🛍️'],
  ['traffic','웹트래픽','🌐'],['website','웹트래픽','🌐'],['google','구글','🔎'],
];
function platOf(t){const low=t.toLowerCase();for(const[en,ko,ic]of PLAT){if(low.includes(en.trim()))return[ko,ic];}return['기타','🌐'];}

function kindOf(t){const s=t.toLowerCase();
  if(s.includes('live')&&(s.includes('view')||s.includes('stream')))return['라이브 시청자','시청자'];
  if(s.includes('subscriber'))return['구독자','팔로워'];
  if(s.includes('follower'))return['팔로워','팔로워'];
  if(s.includes('member'))return['멤버','멤버'];
  if(s.includes('reaction'))return['반응','좋아요'];
  if(s.includes('like'))return['좋아요','좋아요'];
  if(s.includes('comment'))return['댓글','댓글'];
  if(s.includes('share')||s.includes('repost')||s.includes('retweet'))return['공유','공유'];
  if(s.includes('vote')||s.includes('poll'))return['투표','기타'];
  if(s.includes('play'))return['재생','재생'];
  if(s.includes('view')||s.includes('viewer'))return['조회수','조회수'];
  if(s.includes('traffic')||s.includes('visit'))return['트래픽','조회수'];
  return['기타','기타'];
}

const GEO = [
  ['한국','🇰🇷',['korea','korean',' kr ','kr]','[kr','한국']],['일본','🇯🇵',['japan','japanese',' jp ','jp]','[jp']],
  ['미국','🇺🇸',['usa',' us ','us]','[us','american',' america']],['영국','🇬🇧',[' uk ','uk]','[uk','british',' england']],
  ['터키','🇹🇷',['turkey','turkish',' tr ','tr]','[tr']],['브라질','🇧🇷',['brazil','brazilian',' br ','br]','[br']],
  ['러시아','🇷🇺',['russia','russian',' ru ','ru]','[ru']],['인도','🇮🇳',['india','indian',' in ','in]','[in']],
  ['아랍','🇦🇪',['arab',' uae','saudi']],['인도네시아','🇮🇩',['indonesia','indonesian',' id ','id]','[id']],
  ['베트남','🇻🇳',['vietnam',' vn ']],['태국','🇹🇭',['thai','thailand']],['스페인','🇪🇸',['spain','spanish',' es ']],
  ['프랑스','🇫🇷',['france','french',' fr ']],['독일','🇩🇪',['germany','german',' de ']],['멕시코','🇲🇽',['mexico','mexican']],
  ['나이지리아','🇳🇬',['nigeria']],['필리핀','🇵🇭',['philippin']],['유럽','🇪🇺',['europe','european',' eu ']],
];
function geoOf(t){const low=t.toLowerCase();for(const[ko,fl,kws]of GEO){if(kws.some(k=>low.includes(k)))return[ko,fl];}return['글로벌','🌍'];}

const MODS=[['cheap','실속'],['real','실제'],['hq','고품질'],['high quality','고품질'],['premium','프리미엄'],
  ['fast','빠른'],['instant','즉시'],['lifetime','평생'],['guaranteed','보장'],['best','최고급'],
  ['stable','안정'],['slow','천천히'],['geo','지역타겟'],['refill','리필']];
function korName(plat,kind,name){const low=name.toLowerCase();const tags=[];
  for(const[en,ko]of MODS){if(low.includes(en)&&!tags.includes(ko))tags.push(ko);}
  const t=tags.slice(0,2);return plat+' '+kind+(t.length?` (${t.join('·')})`:'');}

function durHint(name){const m=name.toLowerCase().match(/(\d+)\s*(minute|min|hour|hr)/);
  if(m)return m[1]+(m[2].includes('min')?'분':'시간')+' 유지';return'';}

function kconv(s){s=(''+s).trim().toLowerCase().replace(/,/g,'');
  let v=s.endsWith('k')?Math.round(parseFloat(s)*1000):Math.round(parseFloat(s));
  if(!isFinite(v))return'';
  if(v>=10000)return v%10000===0?(v/10000)+'만':(Math.round(v/1000)/10)+'만';
  if(v>=1000)return v%1000===0?(v/1000)+'천':v.toLocaleString('en-US');
  return''+v;}

const WORD={'non-drop':'이탈없음','non drop':'이탈없음','nondrop':'이탈없음','no drop':'이탈없음',
  'no refill':'리필없음','no-refill':'리필없음','lifetime guarantee':'평생보장','lifetime':'평생보장',
  'super instant':'초고속시작','superinstant':'초고속시작','super fast':'초고속','ultra fast':'초고속',
  'high quality':'고품질','real':'실제계정','mq':'중품질','hq':'고품질','lq':'일반품질','cheap':'저가형',
  'premium':'프리미엄','guaranteed':'보장','guarantee':'보장','instant':'즉시시작','fast':'빠른속도',
  'slow':'천천히','drop possible':'이탈가능','mixed':'혼합','mix':'혼합','female':'여성','male':'남성',
  'working':'정상작동','stable':'안정적','old accounts':'오래된계정','with profile':'프로필있음',
  'profile':'프로필','worldwide':'전세계','global':'전세계'};
function oneTok(t){let s=t.trim().toLowerCase();if(!s)return'';let m;
  if(m=s.match(/^(\d+)\s*[-~]\s*(\d+)\s*\/\s*([hm])$/))return'시작 '+m[1]+'~'+m[2]+(m[3]==='h'?'시간':'분');
  if(m=s.match(/^(\d+)\s*\/\s*([hm])$/))return'시작 '+m[1]+(m[2]==='h'?'시간':'분');
  if(m=s.match(/^([\d.,]+k?)\s*[-~]\s*([\d.,]+k?)\s*\/\s*d(ay)?$/)){const a=kconv(m[1]),b=kconv(m[2]);if(a&&b)return'하루 '+a+'~'+b;}
  if(m=s.match(/^([\d.,]+k?)\s*\/\s*d(ay)?$/)){const a=kconv(m[1]);if(a)return'하루 '+a;}
  if(m=s.match(/^drop\s*(\d+)\s*[-~]?\s*(\d*)\s*%?.*$/))return'이탈 '+m[1]+(m[2]?'~'+m[2]:'')+'%';
  if(m=s.match(/refill\s*(\d+)\s*day/))return m[1]+'일 리필';
  if(/^refill/.test(s))return'리필보장';
  if(m=s.match(/^max\s*([\d.,]+k?)$/)){const a=kconv(m[1]);if(a)return'최대 '+a;}
  for(const en in WORD){if(s.includes(en))return WORD[en];}
  return'';}
function detailKo(name){const toks=[];for(const b of (name.match(/\[([^\]]+)\]/g)||[])){for(const t of b.slice(1,-1).split('|'))toks.push(t);}
  const out=[];for(const t of toks){const ko=oneTok(t);if(ko&&!out.includes(ko))out.push(ko);}return out.slice(0,5).join(' · ');}

export function transform(raw, srcname){
  const pref = {'Stream-Promotion':'sp','SMB Panel':'smb','RealSite':'real'}[srcname] || 'x';
  return raw.map(s=>{
    const name=s.name||'', cat=s.category||'', blob=name+' '+cat;
    const [plat,ic]=platOf(blob),[kind,group]=kindOf(blob),[geo,flag]=geoOf(blob);
    const rate=parseFloat(s.rate)||0;
    const hint=durHint(name),det=detailKo(name);
    return {id:pref+s.service, sid:s.service, src:srcname, plat,ic,kind,group,geo,flag,premium:geo==='한국',
      ko:korName(plat,kind,name)+(hint?' · '+hint:''),
      desc:(plat+' '+kind+' 늘리기'+(det?' · '+det:'')), en:(name||'').slice(0,90),
      wholesale:Math.round(rate*USD), price:Math.round(rate*USD*2.5/10)*10,
      min:parseInt(s.min)||0, max:parseInt(s.max)||0,
      refill:!!s.refill, cancel:!!s.cancel, dripfeed:!!s.dripfeed};
  });
}
export function metaOf(out){
  const plats={},kinds={},geos={};
  for(const x of out){plats[x.plat]=(plats[x.plat]||0)+1;kinds[x.kind]=(kinds[x.kind]||0)+1;geos[x.geo]=(geos[x.geo]||0)+1;}
  return {total:out.length,plats,kinds,geos,usd:USD,margin:2.5};
}
