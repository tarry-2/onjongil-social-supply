// 공급처 영문 services → 한국어·플랫폼·종류·나라 변환 (convert_sp.py의 JS 포팅).
// /api/services가 두 공급처 최신 상품을 받아 이걸로 변환해 반환 → 원청 신규 상품 실시간 반영.
const USD = 1400;

// 🔴 순서 중요: 더 구체적인 도메인이 먼저. chzzk.naver.com 이 'naver'보다 'chzzk'에 먼저 걸려야 치지직으로 분류됨.
const PLAT = [
  ['chzzk','치지직','🟢'],   // naver 보다 반드시 앞 (chzzk.naver.com 오분류 방지)
  ['twitch','트위치','🟣'],['kick','킥','🟢'],['youtube','유튜브','▶️'],['telegram','텔레그램','✈️'],
  ['instagram','인스타그램','📸'],['tiktok','틱톡','🎵'],['facebook','페이스북','👍'],['spotify','스포티파이','🎧'],
  ['discord','디스코드','💬'],['threads','스레드','🧵'],['snapchat','스냅챗','👻'],['reddit','레딧','🔺'],
  ['soundcloud','사운드클라우드','☁️'],['rumble','럼블','🎬'],['likee','라이키','💛'],['kwai','콰이','🌈'],
  ['trovo','트로보','🎮'],['whatsapp','왓츠앱','📱'],['boomplay','붐플레이','🎵'],
  ['vk','브콘탁테','🔵'],['twitter','트위터','🐦'],['x ','X(트위터)','✖️'],
  ['soop','숲(아프리카)','🌲'],['afreeca','숲(아프리카)','🌲'],['naver','네이버','🟩'],['kakao','카카오','💛'],
  ['band','밴드','🟩'],['shopee','쇼피','🛒'],['lazada','라자다','🛍️'],['wildberries','와일드베리','🫐'],
  ['traffic','웹트래픽','🌐'],['website','웹트래픽','🌐'],['google','구글','🔎'],
];
function platOf(t){const low=t.toLowerCase();for(const[en,ko,ic]of PLAT){if(low.includes(en.trim()))return[ko,ic];}return['기타','🌐'];}
// 한국 전용 플랫폼: 나라 표기가 없으면 한국으로 보정 (SOOP·치지직·네이버·카카오·밴드)
const KR_PLATS = new Set(['숲(아프리카)','치지직','네이버','카카오','밴드']);

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

// 🔴 나라 분류 견고화: 느슨한 부분매칭(infinity 속 'in', ukraine 속 'uk') 금지.
//   ① 국기 이모지(🇰🇷)가 있으면 그걸로 ② 없으면 토큰 정확일치(단어경계).
//   국가는 원본에 거의 풀네임(Korea/Ukraine/Brazil…)이나 국기로 와서 2글자 코드는 '정확한 토큰'일 때만 인정.
const GEO_FLAG = {한국:'🇰🇷',일본:'🇯🇵',미국:'🇺🇸',영국:'🇬🇧',우크라이나:'🇺🇦',러시아:'🇷🇺',터키:'🇹🇷',브라질:'🇧🇷',인도:'🇮🇳',인도네시아:'🇮🇩',아랍:'🇦🇪',베트남:'🇻🇳',태국:'🇹🇭',스페인:'🇪🇸',프랑스:'🇫🇷',독일:'🇩🇪',멕시코:'🇲🇽',나이지리아:'🇳🇬',필리핀:'🇵🇭',이탈리아:'🇮🇹',폴란드:'🇵🇱',네덜란드:'🇳🇱',유럽:'🇪🇺',글로벌:'🌍'};
// 토큰(소문자, 단어경계) 정확일치 → 한국명
const GEO_WORD = {
  korea:'한국',korean:'한국',kr:'한국',
  japan:'일본',japanese:'일본',jp:'일본',jpn:'일본',
  usa:'미국',us:'미국',america:'미국',american:'미국',
  uk:'영국',british:'영국',england:'영국',gb:'영국',
  ukraine:'우크라이나',ukrainian:'우크라이나',ua:'우크라이나',
  russia:'러시아',russian:'러시아',ru:'러시아',
  turkey:'터키',turkish:'터키',tr:'터키','türkiye':'터키',
  brazil:'브라질',brazilian:'브라질',br:'브라질',
  india:'인도',indian:'인도',
  indonesia:'인도네시아',indonesian:'인도네시아',id:'인도네시아',
  arab:'아랍',arabic:'아랍',uae:'아랍',saudi:'아랍',ksa:'아랍',
  vietnam:'베트남',vietnamese:'베트남',vn:'베트남',
  thailand:'태국',thai:'태국',th:'태국',
  spain:'스페인',spanish:'스페인',es:'스페인',
  france:'프랑스',french:'프랑스',fr:'프랑스',
  germany:'독일',german:'독일',de:'독일',
  mexico:'멕시코',mexican:'멕시코',
  nigeria:'나이지리아',nigerian:'나이지리아',
  philippines:'필리핀',philippine:'필리핀',filipino:'필리핀',ph:'필리핀',
  italy:'이탈리아',italian:'이탈리아',
  poland:'폴란드',polish:'폴란드',
  netherlands:'네덜란드',dutch:'네덜란드',
  europe:'유럽',european:'유럽',
};
// 국기 이모지(regional indicator) → ISO2 → 한국명
const ISO2_GEO = {KR:'한국',JP:'일본',US:'미국',GB:'영국',UA:'우크라이나',RU:'러시아',TR:'터키',BR:'브라질',IN:'인도',ID:'인도네시아',AE:'아랍',SA:'아랍',VN:'베트남',TH:'태국',ES:'스페인',FR:'프랑스',DE:'독일',MX:'멕시코',NG:'나이지리아',PH:'필리핀',IT:'이탈리아',PL:'폴란드',NL:'네덜란드'};
function geoOf(t){
  // ① 국기 이모지 우선(가장 정확)
  const fm=t.match(/[\u{1F1E6}-\u{1F1FF}]{2}/u);
  if(fm){const cc=[...fm[0]].map(ch=>String.fromCharCode(ch.codePointAt(0)-0x1F1E6+65)).join('');if(ISO2_GEO[cc]){const g=ISO2_GEO[cc];return[g,GEO_FLAG[g]];}}
  // ② 토큰 정확일치(단어경계). 영어단어 중간/부분 문자열은 매칭 안 됨.
  const toks=t.toLowerCase().split(/[^a-zçğıöşü]+/i);
  for(const tk of toks){if(GEO_WORD[tk]){const g=GEO_WORD[tk];return[g,GEO_FLAG[g]];}}
  return['글로벌','🌍'];
}
// ===== 특성(뱃지)·소스 추출 =====
// 소스/경로 축: 트래픽이 어디서 오는지 (외부유입·광고·실유저·검색)
function sourceOf(blob){const s=blob.toLowerCase();
  if(/\bexternal\b/.test(s))return'외부유입';
  if(/\bad[s]?\b|advert/.test(s))return'광고';
  if(/\breal\b|active user|real user/.test(s))return'실유저';
  if(/\bsearch\b|discover|explore|browse/.test(s))return'검색/탐색';
  if(/\bprofile\b/.test(s))return'프로필';
  return'';}
// 뱃지: 품질·안정성·속도 중 핵심만(최대 3개). 프론트 색뱃지용.
function badgesOf(blob){const s=blob.toLowerCase();const out=[];
  if(/\bvhq\b/.test(s))out.push('초고품질');
  else if(/\bhq\b|high quality/.test(s))out.push('고품질');
  if(/\breal\b|real user|active user/.test(s))out.push('실제계정');
  if(/no drop|non-?drop|no-?drop/.test(s))out.push('이탈없음');
  if(/super instant|instant|super fast|ultra fast/.test(s))out.push('즉시시작');
  else if(/\bfast\b/.test(s))out.push('빠른속도');
  if(/lifetime|refill/.test(s))out.push('리필보장');
  return out.slice(0,3);}

const MODS=[['cheap','실속'],['real','실제'],['hq','고품질'],['high quality','고품질'],['premium','프리미엄'],
  ['fast','빠른'],['instant','즉시'],['lifetime','평생'],['guaranteed','보장'],['best','최고급'],
  ['stable','안정'],['slow','천천히'],['geo','지역타겟'],['refill','리필']];
// 서브플랫폼(대분류 안의 소분류). 네이버=국내 핵심 → 쇼핑/블로그/검색/플레이스/스마트스토어/카페 구분.
function subOf(plat, blob){const s=blob.toLowerCase();
  if(plat==='네이버'){
    if(/smartstore|smart ?store|스마트스토어/.test(s))return'스마트스토어';
    if(/shopping|쇼핑/.test(s))return'쇼핑';
    if(/blog|블로그|matome/.test(s))return'블로그';
    if(/place|\bmap\b|지도|플레이스/.test(s))return'플레이스';
    if(/cafe|카페/.test(s))return'카페';
    if(/\btv\b/.test(s))return'TV';
    if(/search|organic|검색/.test(s))return'검색';
    return'';
  }
  if(plat==='인스타그램'){
    if(/\breel/.test(s))return'릴스';
    if(/story|스토리/.test(s))return'스토리';
    if(/\bigtv\b/.test(s))return'IGTV';
    return'';
  }
  if(plat==='유튜브'){ if(/\bshorts?\b|쇼츠/.test(s))return'쇼츠'; return''; }
  return'';
}
// 세분 한글명: 플랫폼(+서브) + 종류 + 변별자(품질·성별) + 나라(비한국·비글로벌만). 중복 최소화.
function korName(plat,sub,kind,geo,name){const low=name.toLowerCase();const tags=[];
  for(const[en,ko]of MODS){if(low.includes(en)&&!tags.includes(ko))tags.push(ko);}
  if(/\bfemale\b|여성/.test(low)&&!tags.includes('여성'))tags.push('여성');
  else if(/\bmale\b|남성/.test(low)&&!tags.includes('남성'))tags.push('남성');
  const t=tags.slice(0,2);
  const base=plat+(sub?' '+sub:'')+' '+kind;
  const geoTag=(geo!=='글로벌'&&geo!=='한국')?' ['+geo+']':'';
  return base+(t.length?` (${t.join('·')})`:'')+geoTag;}

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
    const [plat,ic]=platOf(blob),[kind,group]=kindOf(blob);
    let [geo,flag]=geoOf(blob);
    // 한국 전용 플랫폼인데 나라 표기가 없으면(글로벌) 한국으로 보정 — 한국 재고 유실 방지
    if(geo==='글로벌'&&KR_PLATS.has(plat)){geo='한국';flag=GEO_FLAG['한국'];}
    const rate=parseFloat(s.rate)||0;
    const wholesale=Math.round(rate*USD);
    // 🔴 가격 이상치: 원청이 품절표시로 넣는 sentinel(7777777 등) → 도매 1억원 초과는 깨진 rate로 보고 숨김 플래그
    const broken = !isFinite(wholesale) || wholesale<=0 || wholesale>100000000;
    const hint=durHint(name),det=detailKo(name),sub=subOf(plat,blob);
    return {id:pref+s.service, sid:s.service, src:srcname, plat,ic,kind,group,sub,geo,flag,premium:geo==='한국',
      source:sourceOf(blob), badges:badgesOf(blob), broken,
      ko:korName(plat,sub,kind,geo,name)+(hint?' · '+hint:''),
      desc:((plat+(sub?' '+sub:'')+' '+kind+' 늘리기')+(det?' · '+det:'')), en:(name||'').slice(0,90),
      wholesale, price:Math.round(rate*USD*2.5/10)*10,
      min:parseInt(s.min)||0, max:parseInt(s.max)||0,
      refill:!!s.refill, cancel:!!s.cancel, dripfeed:!!s.dripfeed};
  });
}
export function metaOf(out){
  const plats={},kinds={},geos={},subs={};
  let broken=0;
  for(const x of out){
    if(x.broken){broken++;continue;} // 깨진 상품은 집계/노출 제외
    plats[x.plat]=(plats[x.plat]||0)+1;kinds[x.kind]=(kinds[x.kind]||0)+1;geos[x.geo]=(geos[x.geo]||0)+1;
    if(x.sub)subs[x.plat+'>'+x.sub]=(subs[x.plat+'>'+x.sub]||0)+1; // 소분류(대>소) 집계
  }
  return {total:out.length-broken,broken,plats,kinds,geos,subs,usd:USD,margin:2.5};
}
