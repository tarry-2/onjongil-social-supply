/* ===== ON 서플라이 — FlowDesk 셸 연결 (네비·테마·관리자·인트로·PWA) ===== */
(function(){
  const NAV=[['store','서비스몰','🛍'],['order','빠른주문','🛒'],['reseller','파트너·API','⚡'],['wallet','지갑','💳']];
  window._buildNav=function(active){
    const nav=NAV.map(([v,t,ic])=>`<a href="#${v}" data-view="${v}" class="${active===v?'active':''}"><span class="nav-emoji" aria-hidden="true">${ic}</span><span>${t}</span></a>`).join('');
    const d=document.getElementById('desktop-nav'),m=document.getElementById('mobile-nav');
    if(m)m.innerHTML=nav;
    let dhtml=nav;
    if(active==='store'){try{dhtml+=platListHtml();}catch(e){}}
    if(d)d.innerHTML=dhtml;
  };
  function platListHtml(){
    if(typeof CAT==='undefined'||!CAT.length)return '';
    const byPlat={},icon={};
    CAT.forEach(function(c){if(c.broken)return;if(typeof LIVE!=='undefined'&&LIVE&&LIVE.has&&!LIVE.has(c.id))return;byPlat[c.plat]=(byPlat[c.plat]||0)+1;if(!icon[c.plat])icon[c.plat]=c.ic;});
    const order=Object.entries(byPlat).sort((a,b)=>b[1]-a[1]).slice(0,14);
    if(!order.length)return '';
    const cur=(typeof platform!=='undefined')?platform:'all';
    return '<div class="nav-cat-label">플랫폼 카테고리</div><div class="side-cats">'+
      '<button class="side-cat'+(cur==='all'?' on':'')+'" data-plat="all">🌐 <span>전체 상품</span></button>'+
      order.map(function(en){var p=en[0],n=en[1];return '<button class="side-cat'+(cur===p?' on':'')+'" data-plat="'+p.replace(/"/g,'')+'">'+(icon[p]||'🌐')+' <span>'+p+'</span><em>'+n.toLocaleString('ko-KR')+'</em></button>';}).join('')+
      '</div>';
  }
  document.addEventListener('click',function(e){var sc=e.target.closest('.side-cat');if(sc&&typeof openCat==='function'){openCat(sc.dataset.plat);}});
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-view]');
    if(a&&a.dataset.view){ if(e.preventDefault)e.preventDefault(); if(typeof showView==='function')showView(a.dataset.view); return; }
  });
  try{if(localStorage.getItem('supply-theme')==='dark')document.body.classList.add('theme-dark')}catch(e){}
  function themeBtn(){var b=document.querySelector('[data-action="theme"]');if(b)b.textContent=document.body.classList.contains('theme-dark')?'☀️':'🌙';}
  themeBtn(); document.addEventListener('DOMContentLoaded',themeBtn);
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-action="theme"]')){var dark=document.body.classList.toggle('theme-dark');try{localStorage.setItem('supply-theme',dark?'dark':'light')}catch(e2){}themeBtn();}
    if(e.target.closest('[data-action="replay-intro"]')){try{sessionStorage.removeItem('ss_intro')}catch(e2){}location.reload();}
    if(e.target.closest('[data-action="profile"]')){if(typeof openAuth==='function')openAuth('login');}
    if(e.target.closest('[data-action="install"]')){if(typeof pwaInstall==='function')pwaInstall();}
    if(e.target.closest('[data-action="notices"]')){if(typeof openNotices==='function')openNotices();}
  });
  // 로고: 5번 연속 클릭=관리자 비번 / 평소=홈 이동. a href 기본동작(새로고침 느낌) 차단
  var lc=0,lt; document.addEventListener('click',function(e){
    if(!e.target.closest('.logo'))return;
    if(e.preventDefault)e.preventDefault();
    var adm=document.getElementById('admin'); if(adm&&adm.classList.contains('active')){lc=0;return;}
    lc++; clearTimeout(lt); lt=setTimeout(function(){lc=0},1300);
    if(lc>=5){lc=0; if(typeof openAdmin==='function')openAdmin(); return;}
    if(typeof showView==='function')showView('store');
  });
  // 모바일 햄버거 드로어(데스크 왼쪽 사이드바를 모바일서 슬라이드)
  function toggleDrawer(open){var o=(open===undefined)?!document.body.classList.contains('drawer-open'):open;document.body.classList.toggle('drawer-open',o);}
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-action="drawer"]')){toggleDrawer();return;}
    if(e.target.closest('.drawer-scrim')){toggleDrawer(false);return;}
    if(e.target.closest('#desktop-nav a,.side-cat,.profile')){toggleDrawer(false);}
  });
})();

/* ===== 상품 카탈로그(공급처 실데이터 9,134개 · services.js) ===== */
let CAT=window.CATALOG||[], META=window.CATALOG_META||{plats:{},kinds:{},geos:{}};
const UNIT={팔로워:'명',시청자:'명',멤버:'명',좋아요:'개',조회수:'회',재생:'회',댓글:'개',공유:'회',기타:'개'};
const CLS={트위치:'tw',킥:'kk',유튜브:'yt',텔레그램:'tg',인스타그램:'ig',틱톡:'tt',페이스북:'fb',스포티파이:'sp',디스코드:'ds','X(트위터)':'xk',트위터:'xk',브콘탁테:'vk',라이키:'lk',레딧:'rd',스레드:'th',스냅챗:'sc',사운드클라우드:'scl',럼블:'rb',트로보:'tv','숲(아프리카)':'soop',네이버:'nv',카카오:'ka',치지직:'ch',밴드:'bd',쇼피:'shop',라자다:'laz',웹트래픽:'web',구글:'gg',기타:'etc',글로벌:'etc'};
const PH={인스타그램:'https://instagram.com/내아이디',틱톡:'https://tiktok.com/@내아이디',유튜브:'https://youtube.com/watch?v=...',트위치:'https://twitch.tv/내채널',킥:'https://kick.com/내채널',텔레그램:'https://t.me/내채널',스포티파이:'https://open.spotify.com/...',페이스북:'https://facebook.com/내페이지',디스코드:'https://discord.gg/초대코드',웹트래픽:'https://내사이트.com/페이지',스마트스토어:'https://smartstore.naver.com/상점',네이버:'https://blog.naver.com/내아이디',치지직:'https://chzzk.naver.com/내채널',스레드:'https://threads.net/@내아이디','X(트위터)':'https://x.com/내아이디',트위터:'https://x.com/내아이디','숲(아프리카)':'https://sooplive.co.kr/내아이디',레딧:'https://reddit.com/r/채널',사운드클라우드:'https://soundcloud.com/내트랙',왓츠앱:'https://wa.me/번호',카카오:'https://pf.kakao.com/내채널'};
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
/* 판매가 = (개별지정 있으면 그 값) / 없으면 도매가 × (1 + 마진%/100). 둘 다 localStorage. */
let MARGIN=(()=>{try{const v=+localStorage.getItem('supply_margin');return v>0?v:150;}catch(e){return 150;}})();
let PRICEOVER=(()=>{try{return JSON.parse(localStorage.getItem('supply_prices')||'{}');}catch(e){return{};}})();
function savePrices(){try{localStorage.setItem('supply_prices',JSON.stringify(PRICEOVER));}catch(e){}}
function priceOf(c){
  if(PRICEOVER[c.id]>0)return PRICEOVER[c.id];              // 개별 지정가 우선
  return Math.round(c.wholesale*(1+MARGIN/100)/10)*10;      // 없으면 전체 마진
}
// 1개당 단가(1,000당 가격 ÷ 1000). 비교용 — 소수점 나오면 2자리까지.
function per1(per1000){const v=per1000/1000;return '₩'+(v>=1?Math.round(v).toLocaleString('ko-KR'):v.toFixed(2));}
function unitOf(c){return UNIT[c.group]||'개';}

/* ===== 💎 상품 등급(저가·고품질·프리미엄) + 🪂 이탈 표기 — 대행사 컨설팅식 ===== */
/* 원청 데이터의 품질/이탈 신호로 판정. 신호 없으면 그룹 내 가격분위로 보조 배정. */
function _sig(c){
  const b=Array.isArray(c.badges)?c.badges:[], en=(c.en||'').toLowerCase();
  return {
    real:b.includes('실제계정')||/\breal\b|active user|real user/.test(en),
    life:/lifetime/.test(en)||b.includes('초고품질'),
    nodrop:b.includes('이탈없음')||/non.?drop|no.?drop/.test(en),
    refill:c.refill||b.includes('리필보장')||(/refill/.test(en)&&!/no.?refill/.test(en)),
    hq:b.includes('고품질')||/high quality|\bhq\b/.test(en),
    low:/cheap|\blow\b|\blq\b|\bbot/.test(en),
    norefill:/no.?refill/.test(en),
    drop:/drop/.test(en)&&!/non.?drop|no.?drop/.test(en)
  };
}
/* 이탈 표기: 이탈없음 / 이탈가능 / 일반 (실제계정·리필·평생이면 안 빠짐 우선) */
function dropOf(c){
  const s=_sig(c);
  if(s.nodrop||s.life||s.real||s.refill)return'이탈없음';
  if(s.drop||s.norefill)return'이탈가능';
  return'일반';
}
/* 신호 기반 1차 등급(미정은 가격분위로 후속 배정) */
function _tierSig(c){
  const s=_sig(c);
  if(s.real||s.life||(s.nodrop&&s.refill))return'프리미엄';
  if(s.low||s.drop||(s.norefill&&!s.hq&&!s.nodrop))return'저가';
  if(s.hq||s.refill||s.nodrop)return'고품질';
  return'';
}
/* 품질 점수(대표 선정용): 높을수록 좋은 상품 */
function qscore(c){
  const b=Array.isArray(c.badges)?c.badges:[];let s=0;
  if(b.includes('실제계정'))s+=4;
  if(b.includes('초고품질'))s+=3;
  if(b.includes('이탈없음'))s+=3;
  if(b.includes('고품질'))s+=2;
  if(c.refill||b.includes('리필보장'))s+=2;
  if(b.includes('즉시시작'))s+=1;
  if(c._drop==='이탈가능')s-=2;
  return s;
}
/* CAT 전체에 _tier/_drop 주입. 미정은 (플랫폼·종류·나라) 그룹 내 가격 중앙값으로 저가/고품질 배정. */
function annotateTiers(){
  if(!Array.isArray(CAT))return;
  const undec={};
  CAT.forEach(c=>{
    c._drop=dropOf(c);
    const t=_tierSig(c);
    if(t){c._tier=t;}
    else{c._tier='';const k=c.plat+'|'+c.kind+'|'+c.geo;(undec[k]=undec[k]||[]).push(c);}
  });
  // 미정: 그룹 내 가격 중앙값 미만=저가, 이상=고품질
  for(const k in undec){
    const arr=undec[k];
    const prices=arr.map(c=>c.wholesale||0).sort((a,b)=>a-b);
    const mid=prices[Math.floor(prices.length/2)]||0;
    arr.forEach(c=>{c._tier=(c.wholesale<=mid)?'저가':'고품질';});
  }
}
/* 등급 메타(라벨·이모지·색) — MZ·귀엽게 */
const TIER_META={
  프리미엄:{emo:'🏆',label:'프리미엄',cls:'t-prem',tip:'실제 유저·리필·안 빠짐'},
  고품질:{emo:'⭐',label:'고품질',cls:'t-hq',tip:'안정적이고 품질 좋아요'},
  저가:{emo:'💨',label:'저가형',cls:'t-low',tip:'가볍게 숫자 채우기용'},
};
const DROP_META={
  이탈없음:{emo:'🛡️',label:'안 빠져요',cls:'d-safe'},
  이탈가능:{emo:'🪂',label:'이탈 가능',cls:'d-drop'},
};
function tierBadge(c){const m=TIER_META[c._tier];return m?`<span class="tier ${m.cls}">${m.emo} ${m.label}</span>`:'';}
function dropBadge(c){const m=DROP_META[c._drop];return m?`<span class="drop ${m.cls}">${m.emo} ${m.label}</span>`:'';}

/* 특성 뱃지(품질·안정·속도) + 소스(유입경로). 폴백 데이터엔 없을 수 있어 방어적. */
const SRC_ICON={외부유입:'🔗',광고:'📣',실유저:'🙋','검색/탐색':'🔎',프로필:'👤'};
function badgeHtml(c){
  const bs=Array.isArray(c.badges)?c.badges:[];
  let h=tierBadge(c)+dropBadge(c);                            // 💎 등급·이탈 먼저(눈에 딱)
  h+=bs.map(t=>`<span class="bdg">${esc(t)}</span>`).join('');
  if(c.source)h+=`<span class="bdg src">${SRC_ICON[c.source]||'•'} ${esc(c.source)}</span>`;
  return h?`<div class="bdgs">${h}</div>`:'';
}
function clsOf(c){return CLS[c.plat]||'etc';}
function phOf(c){return PH[c.plat]||'주문할 공개 링크를 입력하세요';}

annotateTiers();   // 💎 CAT에 _tier/_drop 주입(공개셋 계산 전에)
/* 공개 목록(관리자 토글) — localStorage. 없으면 기본 공개셋 자동 생성 */
function defaultLive(){
  // 전체 공개 = 깨지지 않은 전체 상품(중복 포함 다 노출). 관리자 '전체공개' 버튼용.
  return new Set(CAT.filter(c=>!c.broken).map(c=>c.id));
}
/* 🧹 중복정리 공개셋(기본) — 똑같은 잉여만 숨기고 대표만 노출.
   한국=잘게(수량까지 구분) 많이 남겨 디테일 / 해외=나라·종류·등급별 대표 1개로 간결.
   각 그룹 대표 = 품질점수 높은 것 → 같으면 최저가. 삭제 아님(숨김), 복구 가능. */
function dedupLive(){
  const keep=new Set(), grp={};
  CAT.forEach(c=>{
    if(c.broken)return;
    if(c.premium){keep.add(c.id);return;}           // 🇰🇷 한국은 묶지 않고 전부 노출(디테일)
    // 해외만 나라·종류·등급별로 묶어 대표 1개
    const k=[c.plat,c.sub,c.kind,c.geo,c._tier].join('|');
    (grp[k]=grp[k]||[]).push(c);
  });
  for(const k in grp){
    const arr=grp[k];
    arr.sort((a,b)=>qscore(b)-qscore(a)||priceOf(a)-priceOf(b)); // 품질↑, 같으면 가격↓
    keep.add(arr[0].id);
  }
  return keep;
}
/* 추천 셋(관리자 '추천 기본셋 적용'용) — 기본템 위주 선별 */
function curatedLive(){
  const picked=new Set();
  const majors=['인스타그램','틱톡','유튜브','페이스북','텔레그램','스포티파이','트위치','킥','트위터','X(트위터)'];
  const basics=['팔로워','좋아요','조회수','멤버','재생','시청자','댓글'];
  majors.forEach(p=>basics.forEach(g=>{
    CAT.filter(c=>c.plat===p&&c.group===g&&!c.broken).sort((a,b)=>priceOf(a)-priceOf(b)).slice(0,3).forEach(c=>picked.add(c.id));
  }));
  CAT.filter(c=>c.premium&&!c.broken).slice(0,40).forEach(c=>picked.add(c.id));
  return picked;
}
const LIVE_VER='5'; // 🧹 중복정리(dedup) 기본 적용 — 옛 저장분 무효화
function loadLive(){ try{
  if(localStorage.getItem('supply_live_v')===LIVE_VER){const s=localStorage.getItem('supply_live'); if(s)return new Set(JSON.parse(s));}
}catch(e){} return dedupLive(); }
function saveLive(){ try{localStorage.setItem('supply_live',JSON.stringify([...LIVE]));localStorage.setItem('supply_live_v',LIVE_VER);}catch(e){} }
let LIVE=loadLive();
/* 인기상품(박스로 크게 노출) — 관리자가 지정. 나머지는 리스트형. */
function loadHot(){ try{const s=localStorage.getItem('supply_hot'); if(s)return new Set(JSON.parse(s));}catch(e){} return new Set(); }
function saveHot(){ try{localStorage.setItem('supply_hot',JSON.stringify([...HOT]));}catch(e){} }
let HOT=loadHot();

/* ===== 카테고리(종류) — 관리자가 수정·추가·삭제·숨김. key=상품 group값. ===== */
function defaultCats(){
  // 실제 데이터의 group들에서 자동 생성(많은 순)
  const cnt={}; CAT.forEach(c=>cnt[c.group]=(cnt[c.group]||0)+1);
  const LABEL={팔로워:'팔로워',좋아요:'좋아요',조회수:'조회수',시청자:'라이브 시청자',멤버:'멤버',재생:'재생',댓글:'댓글',공유:'공유',기타:'기타'};
  return Object.entries(cnt).sort((a,b)=>b[1]-a[1]).map(([k])=>({key:k,label:LABEL[k]||k,hidden:false}));
}
function loadCats(){try{const s=localStorage.getItem('supply_cats');if(s)return JSON.parse(s);}catch(e){}return defaultCats();}
function saveCats(){try{localStorage.setItem('supply_cats',JSON.stringify(CATS));}catch(e){}}
let CATS=loadCats();
function renderPills(){
  const box=document.getElementById('pills'); if(!box)return;
  // 🔴 현재 플랫폼의 실제 종류로(유튜브=구독자, 인스타=팔로워, 트위치=라이브시청자…). 전체 선택 시엔 통합(group)
  var cnt={};
  CAT.forEach(function(c){ if(c.broken||!LIVE.has(c.id))return;
    if(origin!=='all'&&(origin==='kr'?!c.premium:c.premium))return;
    if(platform!=='all'&&c.plat!==platform)return;
    var key=(platform==='all')?c.group:c.kind;
    cnt[key]=(cnt[key]||0)+1;
  });
  var order=Object.entries(cnt).sort(function(a,b){return b[1]-a[1];});
  let h=`<button class="pill${kind==='all'?' active':''}" data-kind="all">전체</button>`;
  order.forEach(function(e){h+=`<button class="pill${kind===e[0]?' active':''}" data-kind="${esc(e[0])}">${esc(e[0])} <em>${e[1].toLocaleString('ko-KR')}</em></button>`;});
  box.innerHTML=h;
  box.querySelectorAll('.pill').forEach(b=>b.addEventListener('click',()=>{kind=b.dataset.kind;renderPills();resetAndRender();}));
}
/* 유입·세부(소분류) pills — 현재 플랫폼에 sub(네이버 쇼핑/블로그/검색 등)가 있으면 노출 */
function renderSubPills(){
  const box=document.getElementById('subpills'); if(!box)return;
  if(platform==='all'){box.innerHTML='';box.style.display='none';return;}
  const cnt={};
  CAT.forEach(c=>{if(c.broken||!LIVE.has(c.id)||c.plat!==platform)return;
    if(origin!=='all'&&(origin==='kr'?!c.premium:c.premium))return;
    if(c.sub)cnt[c.sub]=(cnt[c.sub]||0)+1;});
  const subs=Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
  if(!subs.length){box.innerHTML='';box.style.display='none';return;}
  box.style.display='flex';
  let h=`<button class="subpill${subf==='all'?' active':''}" data-sub="all">세부 전체</button>`;
  subs.forEach(([s,n])=>{h+=`<button class="subpill${subf===s?' active':''}" data-sub="${esc(s)}">${esc(s)} <em>${n.toLocaleString('ko-KR')}</em></button>`;});
  box.innerHTML=h;
  box.querySelectorAll('.subpill').forEach(b=>b.addEventListener('click',()=>{subf=b.dataset.sub;renderSubPills();resetAndRender();}));
}

let platform='all',kind='all',geo='all',sortMode='reco',shown=20,origin='kr',subf='all';
const cardsBox=document.getElementById('cards');

function matchedAll(onlyLive){
  const q=document.getElementById('search').value.trim().toLowerCase();
  let list=CAT.filter(c=>
    !c.broken&&                                                 // 깨진 rate(품절 sentinel) 숨김
    (!onlyLive||LIVE.has(c.id))&&
    (origin==='all'||(origin==='kr'?c.premium:!c.premium))&&   // 🇰🇷한국인 / 🌍외국인 분리
    (platform==='all'||c.plat===platform)&&
    (subf==='all'||c.sub===subf)&&
    (kind==='all'||(platform==='all'?c.group===kind:c.kind===kind))&&
    (geo==='all'||c.geo===geo)&&
    (!q||(c.ko+c.plat+c.group+c.geo+c.en).toLowerCase().includes(q))
  );
  if(sortMode==='popular')list.sort((a,b)=>b.max-a.max);
  else if(sortMode==='low')list.sort((a,b)=>priceOf(a)-priceOf(b));
  else if(sortMode==='high')list.sort((a,b)=>priceOf(b)-priceOf(a));
  return list;
}
/* 리스트형 한 줄 */
function rowHtml(c){
  const unit=unitOf(c),cls=clsOf(c),pr=priceOf(c),refillTxt=c.refill?'리필 포함':'리필 미포함';
  return `<div class="prow" data-platform="${esc(c.plat)}" data-kind="${esc(c.group)}"
    data-name="${esc(c.ko)}" data-icon="${esc(c.ic)}" data-iconcls="${cls}"
    data-price="${pr}" data-min="${c.min}" data-max="${c.max}" data-unit="${unit}" data-start="0~수 시간" data-refill="${refillTxt}"
    data-ph="${esc(phOf(c))}" onclick="openDetail(this)">
    <div class="prow-ic ${cls}">${esc(c.ic)}</div>
    <div class="prow-main">
      <div class="prow-name">${esc(c.ko)}${c.premium?'<span class="kr">🇰🇷 한국인</span>':''}</div>
      <div class="prow-sub">${esc(c.desc||'')} · 최소 ${c.min.toLocaleString('ko-KR')}${unit}~ · ${refillTxt}</div>
      ${badgeHtml(c)}
    </div>
    <div class="prow-price"><div class="big">${per1(pr)}</div><div class="per">1${unit}당 · 1,000당 ₩${pr.toLocaleString('ko-KR')}</div></div>
    <button class="prow-buy" onclick="event.stopPropagation();openOrder(this.closest('.prow'))">주문</button>
  </div>`;
}
function cardHtml(c){
  const unit=unitOf(c),cls=clsOf(c),refillTxt=c.refill?'리필 포함':'리필 미포함',pr=priceOf(c);
  const minBuy=Math.round(pr*c.min/1000);
  const metas=[`최소 ${c.min.toLocaleString('ko-KR')}${unit}`,`최대 ${c.max.toLocaleString('ko-KR')}${unit}`,refillTxt];
  const tag=c.premium?`<span class="tag krtag">🇰🇷 프리미엄</span>`:`<span class="tag">${c.flag} ${c.geo}</span>`;
  return `<article class="card" data-platform="${esc(c.plat)}" data-kind="${esc(c.group)}"
    data-name="${esc(c.ko)}" data-icon="${esc(c.ic)}" data-iconcls="${cls}"
    data-price="${pr}" data-min="${c.min}" data-max="${c.max}" data-unit="${unit}" data-start="0~수 시간" data-refill="${refillTxt}"
    data-ph="${esc(phOf(c))}">
    <div class="cardtop"><div class="socialicon ${cls}">${esc(c.ic)}</div>${tag}</div>
    <div class="cardbody">
      <h3>${esc(c.ko)}</h3>
      <div class="carddesc">${esc(c.desc||'')}</div>
      ${badgeHtml(c)}
      <div class="metas">${metas.map(m=>`<span class="meta">${esc(m)}</span>`).join('')}</div>
    </div>
    <div class="cardfoot">
      <div><div class="price">${per1(pr)} <small>/ 1${unit}</small></div>
        <div class="per1k">1,000${unit}당 ₩${pr.toLocaleString('ko-KR')} · 최소 ${c.min.toLocaleString('ko-KR')}${unit}~</div></div>
      <button class="order" onclick="openOrder(this)">주문하기</button>
    </div>
  </article>`;
}
/* ===== 카테고리 페이지: 리스트 + 페이지네이션 ===== */
const PER_PAGE=24; let catPage=0;
function renderCards(){
  const list=matchedAll(true);
  // 🔥 인기(박스) = 관리자 HOT 지정 중 현재 필터에 맞는 것 (1페이지에서만)
  const hot=list.filter(c=>HOT.has(c.id)).slice(0,8);
  const hotSec=document.getElementById('hotSec');
  if(hot.length&&catPage===0){document.getElementById('hotRow').innerHTML=hot.map(cardHtml).join('');hotSec.style.display='block';}
  else hotSec.style.display='none';
  // 📋 전체(리스트, 페이지네이션) = 인기 제외 나머지
  const rest=list.filter(c=>!HOT.has(c.id));
  const pages=Math.max(1,Math.ceil(rest.length/PER_PAGE));
  if(catPage>=pages)catPage=0;
  const slice=rest.slice(catPage*PER_PAGE,catPage*PER_PAGE+PER_PAGE);
  cardsBox.innerHTML=slice.map(rowHtml).join('');
  const lh=document.getElementById('listHead');
  lh.style.display=rest.length?'block':'none';
  lh.textContent=`전체 상품 (${rest.length.toLocaleString('ko-KR')}개)`;
  document.getElementById('noResult').style.display=list.length?'none':'block';
  const sub=document.getElementById('catSub'); if(sub)sub.textContent=`${list.length.toLocaleString('ko-KR')}개 상품`;
  const pg=document.getElementById('catPager');
  if(rest.length>PER_PAGE){
    pg.style.display='flex';
    pg.innerHTML=`<button ${catPage<=0?'disabled':''} onclick="catGo(-1)">← 이전</button>`+
      `<span>${catPage+1} / ${pages.toLocaleString('ko-KR')}</span>`+
      `<button ${catPage>=pages-1?'disabled':''} onclick="catGo(1)">다음 →</button>`;
  } else pg.style.display='none';
}
function catGo(d){catPage+=d;renderCards();window.scrollTo({top:0,behavior:'smooth'});}
function resetAndRender(){catPage=0;renderCards();}
function showMore(){catPage++;renderCards();} // 하위호환

/* 🏬 메인 쇼윈도: 플랫폼별 인기 4개 + 전체보기 */
const SC_PLATS=8, SC_CARDS=4;
function renderShowcase(){
  const box=document.getElementById('showcase'); if(!box)return;
  const live=CAT.filter(c=>!c.broken&&LIVE.has(c.id)&&(origin==='all'||(origin==='kr'?c.premium:!c.premium)));
  const byPlat={}; live.forEach(c=>{(byPlat[c.plat]=byPlat[c.plat]||[]).push(c);});
  const order=Object.entries(byPlat).sort((a,b)=>b[1].length-a[1].length).slice(0,SC_PLATS);
  const empty=document.getElementById('scEmpty');
  if(!order.length){box.innerHTML='';if(empty)empty.style.display='block';return;}
  if(empty)empty.style.display='none';
  // 📱 모바일(≤650)=행 리스트(rowHtml, 인스타몬스터식 스크롤) / 💻 PC·태블릿=카드(cardHtml)
  const mobile=window.innerWidth<=650, scRender=mobile?rowHtml:cardHtml, nCard=mobile?4:SC_CARDS;
  box.innerHTML=order.map(([p,arr])=>{
    const ic=arr[0].ic;
    const top=arr.slice().sort((a,b)=>(HOT.has(b.id)-HOT.has(a.id))||(b.max-a.max)).slice(0,nCard);
    return `<section class="sc-sec">
      <div class="sc-sec-head">
        <h3><span class="sc-ic">${esc(ic)}</span> ${esc(p)} <span class="sc-n">${arr.length.toLocaleString('ko-KR')}</span></h3>
        <button class="sc-all" onclick="openCat('${esc(p).replace(/'/g,"\\'")}')">전체보기 →</button>
      </div>
      <div class="cards sc-cards${mobile?' sc-rows':''}">${top.map(scRender).join('')}</div>
    </section>`;
  }).join('');
}
/* 전체보기 → 카테고리 페이지 */
function openCat(plat){
  platform=plat; kind='all'; geo='all'; subf='all'; catPage=0;
  // 🔴 현재 한국/외국 탭에 이 플랫폼 상품이 없으면 '전체'로 자동 전환(빈 화면 방지)
  var hasInOrigin=CAT.some(function(c){return c.plat===plat&&!c.broken&&LIVE.has(c.id)&&(origin==='all'||(origin==='kr'?c.premium:!c.premium));});
  if(!hasInOrigin){origin='all';document.querySelectorAll('.geotab').forEach(function(x){x.classList.toggle('active',x.dataset.origin==='all');});}
  document.querySelectorAll('#platSide button').forEach(x=>x.classList.toggle('selected',x.dataset.platform===plat));
  const gs=document.getElementById('geoSel'); if(gs)gs.value='all';
  setCatTitle();
  renderPills(); renderSubPills();
  showView('catpage');
  renderCards();
}
function setCatTitle(){
  const t=document.getElementById('catTitle'); if(!t)return;
  if(platform==='all'){t.textContent='🌐 전체 상품';return;}
  const ic=(CAT.find(c=>c.plat===platform)||{}).ic||'🌐';
  t.textContent=`${ic} ${platform}`;
}
/* 현재 보이는 뷰에 맞춰 다시 그림 */
function rerenderCurrent(){
  if(document.getElementById('store').classList.contains('active'))renderShowcase();
  else{catPage=0;renderCards();}
}
/* 한국/외국 분리 탭 (쇼윈도·카테고리 공용) */
document.querySelectorAll('.geotab').forEach(b=>b.addEventListener('click',()=>{
  origin=b.dataset.origin;
  document.querySelectorAll('.geotab').forEach(x=>x.classList.toggle('active',x.dataset.origin===origin));
  renderPills(); renderSubPills(); rerenderCurrent();
}));

/* 사이드바(실제 공급 플랫폼) 채우기 — 재호출 가능(동기화 후 갱신) */
function fillSide(){
  const side=document.getElementById('platSide');
  side.querySelectorAll('button[data-platform]').forEach(b=>{if(b.dataset.platform!=='all')b.remove();});
  const icon={}; CAT.forEach(c=>{if(!icon[c.plat])icon[c.plat]=c.ic;});
  const liveByPlat={}; CAT.forEach(c=>{if(LIVE.has(c.id))liveByPlat[c.plat]=(liveByPlat[c.plat]||0)+1;});
  const order=Object.entries(liveByPlat).sort((a,b)=>b[1]-a[1]);
  const allCount=side.querySelector('button[data-platform="all"] .count'); if(allCount)allCount.textContent=[...LIVE].length.toLocaleString('ko-KR');
  order.forEach(([p,n])=>{
    const b=document.createElement('button');
    b.dataset.platform=p;
    b.innerHTML=`${icon[p]||'🌐'} ${p} <span class="count">${n}</span>`;
    side.appendChild(b);
  });
}
fillSide();
/* 나라 select 채우기(한국 맨 위) — 재호출 가능 */
function fillGeo(){
  const sel=document.getElementById('geoSel'), geos=META.geos||{};
  const order=Object.entries(geos).sort((a,b)=>b[1]-a[1]);
  let html='<option value="all">🌍 모든 나라</option>';
  if(geos['한국'])html+=`<option value="한국">🇰🇷 한국 프리미엄 (${geos['한국']})</option>`;
  order.filter(x=>x[0]!=='한국'&&x[0]!=='글로벌').forEach(([g,n])=>{html+=`<option value="${esc(g)}">${esc(g)} (${n})</option>`;});
  if(geos['글로벌'])html+=`<option value="글로벌">🌍 글로벌 (${geos['글로벌']})</option>`;
  sel.innerHTML=html;
}
fillGeo();

document.getElementById('platSide').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  document.querySelectorAll('#platSide button').forEach(x=>x.classList.toggle('selected',x===b));
  platform=b.dataset.platform;kind='all';subf='all';setCatTitle();renderPills();renderSubPills();resetAndRender();
});
renderPills();
document.getElementById('geoSel').addEventListener('change',e=>{geo=e.target.value;resetAndRender();});
document.getElementById('sortSel').addEventListener('change',e=>{sortMode=e.target.value;resetAndRender();});
/* 검색: 상품이 있으면 카테고리 전체보기로 이동해 결과를 보여줌 */
function searchProducts(){const q=document.getElementById('search').value.trim();if(!q){showView('store');renderShowcase();return;}platform='all';kind='all';geo='all';subf='all';catPage=0;setCatTitle();renderPills();renderSubPills();showView('catpage');renderCards();}
document.getElementById('search').addEventListener('input',()=>{if(document.getElementById('catpage').classList.contains('active'))resetAndRender();});
renderShowcase();

/* ===== 관리자: 상품 공개 관리(9,134개 토글) ===== */
let aPlat='all',aKind='all',aGeo='all',aSrc='all',aPage=0; const A_PER=50;
function attrBadges(c){
  const b=(ok,t)=>`<span class="attr ${ok?'y':'n'}">${t}</span>`;
  return b(c.refill,'리필')+b(c.cancel,'취소')+b(c.dripfeed,'드립피드');
}
function fillAdminSelects(){
  const mk=(sel,obj,label)=>{let h=`<option value="all">${label}</option>`;
    Object.entries(obj).sort((a,b)=>b[1]-a[1]).forEach(([k,n])=>h+=`<option value="${esc(k)}">${esc(k)} (${n})</option>`);
    document.getElementById(sel).innerHTML=h;};
  const SRCS={}; CAT.forEach(c=>SRCS[c.src]=(SRCS[c.src]||0)+1);   // 공급처(회사)별 집계
  const GROUPS={}; CAT.forEach(c=>{if(!c.broken)GROUPS[c.group]=(GROUPS[c.group]||0)+1;}); // 종류=group 통일(서비스몰과 동일, 구독자=팔로워)
  mk('aPlat',META.plats||{},'모든 플랫폼'); mk('aKind',GROUPS,'모든 종류');
  mk('aGeo',META.geos||{},'모든 나라'); mk('aSrc',SRCS,'🏢 모든 공급처');
}
fillAdminSelects();
function adminFilter(){
  const q=document.getElementById('aSearch').value.trim().toLowerCase();
  return CAT.filter(c=>
    (aPlat==='all'||c.plat===aPlat)&&(aKind==='all'||c.group===aKind)&&(aGeo==='all'||c.geo===aGeo)&&
    (aSrc==='all'||c.src===aSrc)&&
    (!q||(c.ko+c.plat+c.kind+c.geo+c.en).toLowerCase().includes(q)));
}
function aStats(){
  document.getElementById('aTotal').textContent=CAT.length.toLocaleString('ko-KR');
  document.getElementById('aLiveN').textContent=LIVE.size.toLocaleString('ko-KR');
  document.getElementById('aKrN').textContent=CAT.filter(c=>c.premium).length.toLocaleString('ko-KR');
}
function aCountTxt(){
  const list=adminFilter(), liveN=list.filter(c=>LIVE.has(c.id)).length;
  document.getElementById('aCount').textContent=`${list.length.toLocaleString('ko-KR')}개 중 ${liveN.toLocaleString('ko-KR')}개 공개`;
  const c2=document.getElementById('aCount2'); if(c2)c2.textContent=list.length.toLocaleString('ko-KR')+'개';
  return list;
}
function adminRender(){
  const list=aCountTxt();
  if(list.length===0&&CAT.length>0){console.warn('[관리자 진단] 필터 결과 0개 — 상태:',{CATlen:CAT.length,aPlat,aKind,aGeo,aSrc,search:(document.getElementById('aSearch')||{}).value,LIVEsize:LIVE.size});}
  const pages=Math.max(1,Math.ceil(list.length/A_PER));
  if(aPage>=pages)aPage=0;
  const slice=list.slice(aPage*A_PER,aPage*A_PER+A_PER);
  document.getElementById('aRows').innerHTML=slice.map(c=>{
    const pr=priceOf(c), profit=pr-c.wholesale;
    return `<tr>
    <td><strong>${esc(c.ic)} ${esc(c.ko)}</strong><div class="arow-desc">${esc(c.desc||c.en)}</div></td>
    <td>${esc(c.group)}${c.kind!==c.group?`<div class="arow-sub">${esc(c.kind)}</div>`:''}</td>
    <td>${c.premium?'🇰🇷 <b>한국</b>':esc(c.flag)+' '+esc(c.geo)}</td>
    <td class="arange"><b>${c.min.toLocaleString('ko-KR')}</b> ~ ${c.max.toLocaleString('ko-KR')}</td>
    <td class="attrs">${attrBadges(c)}</td>
    <td><span class="sourcechip">${esc(c.src)}</span></td>
    <td>₩${c.wholesale.toLocaleString('ko-KR')}<div class="arow-sub">1,000당 · 1개 ${per1(c.wholesale)}</div></td>
    <td class="aprice">
      <input class="pedit" type="number" value="${pr}" data-id="${esc(c.id)}" title="개별 판매가(1,000당). 비우면 전체 마진 적용">
      <div class="arow-sub">1개 <b>${per1(pr)}</b></div>
      <div class="aprofit${profit<0?' minus':''}">${profit>=0?'+':''}₩${profit.toLocaleString('ko-KR')}${PRICEOVER[c.id]>0?' ✏️':''}</div>
    </td>
    <td><button class="hotbtn${HOT.has(c.id)?' on':''}" data-hot="${esc(c.id)}" title="고객 화면에 박스(인기)로 크게 노출">🔥</button></td>
    <td><span class="toggle${LIVE.has(c.id)?' on':''}" data-id="${esc(c.id)}"></span></td>
  </tr>`;}).join('');
  document.getElementById('aPager').innerHTML=
    `<button ${aPage<=0?'disabled':''} onclick="aGo(-1)">← 이전</button>`+
    `<span>${aPage+1} / ${pages.toLocaleString('ko-KR')}</span>`+
    `<button ${aPage>=pages-1?'disabled':''} onclick="aGo(1)">다음 →</button>`;
  aStats();
}
function aGo(d){aPage+=d;adminRender();}
function bulkLive(on){
  adminFilter().forEach(c=>{on?LIVE.add(c.id):LIVE.delete(c.id);});
  saveLive();adminRender();try{renderCards();}catch(e){}
  toast(on?'현재 목록을 전체 공개했습니다':'현재 목록을 숨겼습니다');
}
function bulkHot(on){
  adminFilter().forEach(c=>{on?HOT.add(c.id):HOT.delete(c.id);});
  saveHot();adminRender();try{renderCards();}catch(e){}
  toast(on?'현재 목록을 인기로 지정했습니다':'현재 목록 인기 해제했습니다');
}
function bulkMargin(){
  const v=prompt('이 목록에만 적용할 마진율(%)을 입력하세요. 예: 200','');
  if(v===null)return; const m=Math.max(0,Math.round(+v||0));
  adminFilter().forEach(c=>{PRICEOVER[c.id]=Math.round(c.wholesale*(1+m/100)/10)*10;});
  savePrices();adminRender();try{renderCards();}catch(e){}
  toast(`현재 목록 ${adminFilter().length.toLocaleString('ko-KR')}개에 마진 ${m}% 적용`);
}
function bulkClearPrice(){
  adminFilter().forEach(c=>{delete PRICEOVER[c.id];});
  savePrices();adminRender();try{renderCards();}catch(e){}
  toast('현재 목록 개별가 초기화(전체 마진으로 복귀)');
}
document.getElementById('aRows').addEventListener('click',e=>{
  const hb=e.target.closest('.hotbtn');
  if(hb){const id=hb.dataset.hot; HOT.has(id)?HOT.delete(id):HOT.add(id); hb.classList.toggle('on'); saveHot(); try{renderCards();}catch(e){} return;}
  const t=e.target.closest('.toggle'); if(!t)return;
  const id=t.dataset.id;
  LIVE.has(id)?LIVE.delete(id):LIVE.add(id);
  t.classList.toggle('on'); saveLive(); aStats(); aCountTxt();
  try{renderCards();}catch(e){}
});
// 개별 판매가 수정(입력칸) — 비우면 전체 마진으로 복귀
document.getElementById('aRows').addEventListener('change',e=>{
  const inp=e.target.closest('.pedit'); if(!inp)return;
  const id=inp.dataset.id, v=Math.round(+inp.value||0);
  if(v>0)PRICEOVER[id]=v; else delete PRICEOVER[id];
  savePrices(); adminRender(); try{renderCards();}catch(e){}
});
document.getElementById('aSearch').addEventListener('input',()=>{aPage=0;adminRender();});
['aPlat','aKind','aGeo','aSrc'].forEach(id=>document.getElementById(id).addEventListener('change',e=>{
  if(id==='aPlat')aPlat=e.target.value; else if(id==='aKind')aKind=e.target.value;
  else if(id==='aGeo')aGeo=e.target.value; else aSrc=e.target.value;
  aPage=0;adminRender();
}));
adminRender();

/* ===== 판매가 마진(자유 설정) ===== */
function updateMarginUI(){
  const mi=document.getElementById('marginIn'); if(mi)mi.value=MARGIN;
  const ex=Math.round(1000*(1+MARGIN/100)/10)*10;
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set('mPct',MARGIN); set('marginEx',ex.toLocaleString('ko-KR')+'원'); set('mCount',CAT.length.toLocaleString('ko-KR'));
}
function applyMargin(){
  const v=Math.max(0,Math.round(+document.getElementById('marginIn').value||0));
  MARGIN=v; try{localStorage.setItem('supply_margin',MARGIN);}catch(e){}
  updateMarginUI(); adminRender(); try{renderCards();}catch(e){}
  toast('판매가 마진 '+v+'% 적용 — 전체 '+CAT.length.toLocaleString('ko-KR')+'개 재계산');
}
function setMarginQuick(v){document.getElementById('marginIn').value=v;applyMargin();}
updateMarginUI();

/* ===== 카테고리 관리(수정·추가·삭제·숨김) ===== */
function catCount(key){return CAT.filter(c=>c.group===key).length;}
function renderCatAdmin(){
  const box=document.getElementById('catList'); if(!box)return;
  box.innerHTML=CATS.map((c,i)=>`<div class="catrow${c.hidden?' hidden-cat':''}">
    <span class="cdrag">≡</span>
    <input class="cname" value="${esc(c.label)}" data-i="${i}">
    <span class="ckey">(${esc(c.key)})</span>
    <span class="ccount">${catCount(c.key).toLocaleString('ko-KR')}개</span>
    <button class="chide${c.hidden?'':' on'}" data-i="${i}" data-act="hide">${c.hidden?'숨김됨':'보임'}</button>
    <button class="cdel" data-i="${i}" data-act="del">삭제</button>
  </div>`).join('');
  // 새 카테고리 key 후보(상품 group들)
  const sel=document.getElementById('catNewKey');
  const groups=[...new Set(CAT.map(c=>c.group))];
  sel.innerHTML='<option value="">매칭 종류 선택</option>'+groups.map(g=>`<option value="${esc(g)}">${esc(g)} (${catCount(g)})</option>`).join('');
}
document.getElementById('catList').addEventListener('input',e=>{
  const inp=e.target.closest('.cname'); if(!inp)return;
  CATS[+inp.dataset.i].label=inp.value; saveCats(); renderPills();
});
document.getElementById('catList').addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  const i=+b.dataset.i;
  if(b.dataset.act==='hide'){CATS[i].hidden=!CATS[i].hidden;}
  else if(b.dataset.act==='del'){if(!confirm('이 카테고리를 목록에서 삭제할까요?'))return;CATS.splice(i,1);}
  saveCats(); renderCatAdmin(); renderPills();
});
function addCat(){
  const label=document.getElementById('catNew').value.trim();
  const key=document.getElementById('catNewKey').value;
  if(!label){toast('카테고리 이름을 입력하세요');return;}
  if(!key){toast('매칭할 종류를 선택하세요');return;}
  CATS.push({key,label,hidden:false}); saveCats();
  document.getElementById('catNew').value='';
  renderCatAdmin(); renderPills(); toast('카테고리 추가: '+label);
}
function resetCats(){CATS=defaultCats();saveCats();renderCatAdmin();renderPills();toast('카테고리 기본값 복원');}
renderCatAdmin();

/* ===== 공개 기본셋 재설정(추천 기본템 위주) ===== */
function resetLive(){
  LIVE=curatedLive(); saveLive(); adminRender(); try{renderShowcase();renderCards();}catch(e){}
  toast('추천 기본셋 적용 — '+LIVE.size.toLocaleString('ko-KR')+'개 공개');
}
function openAllLive(){
  LIVE=defaultLive(); saveLive(); adminRender(); try{renderShowcase();renderCards();}catch(e){}
  toast('전체 공개 — '+LIVE.size.toLocaleString('ko-KR')+'개');
}
/* 🧹 중복정리 — 똑같은 잉여 숨기고 대표(한국 세분화·해외 등급별)만 공개 */
function trimDupLive(){
  LIVE=dedupLive(); saveLive(); adminRender(); try{renderShowcase();renderCards();}catch(e){}
  toast('🧹 중복정리 완료 — 대표 '+LIVE.size.toLocaleString('ko-KR')+'개만 공개');
}

/* ===== 원청 상품 실시간 동기화(Vercel /api/services) ===== */
// 공급처가 새 상품을 올리면 '상품 동기화'로 최신 전체를 받아 한국어 변환본으로 교체한다.
async function loadCatalog(){
  try{
    toast('공급처에서 최신 상품 동기화 중…');
    const r=await fetch(API_BASE+'/api/services',{cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const d=await r.json();
    if(d && d.catalog && d.catalog.length){
      CAT=d.catalog; META=d.meta||META;
      annotateTiers(); LIVE=dedupLive(); saveLive();   // 💎 새 데이터 등급 주입 + 🧹 중복정리 재적용
      fillSide(); fillGeo(); fillAdminSelects(); renderPills(); renderCatAdmin(); renderShowcase(); resetAndRender(); adminRender(); updateMarginUI();
      const errN=d.errors?Object.keys(d.errors).length:0;
      toast('✅ 동기화 완료 — 전체 '+CAT.length.toLocaleString('ko-KR')+'개'+(errN?' (일부 공급처 오류)':''));
    } else throw new Error('빈 응답');
  }catch(e){
    toast('동기화 실패 — Vercel 배포 후 작동합니다 ('+e.message+')');
  }
}

/* ===== 공급처 실시간 잔액(Vercel 백엔드 /api/balance, 키 숨김) ===== */
// 사이트가 Vercel이면 상대경로, GitHub Pages면 api.온종일.com 절대경로로 폴백.
const API_BASE = location.hostname.endsWith('github.io') ? 'https://api.xn--zk5biyyw.com' : '';
/* 공급처 → {로고, 설명}. 연동은 다양하게(없는 게 없게), 충전은 주력만(테리 2026-11-05).
   ★주력(충전 대상)=main:true. 나머지는 재고만 노출. */
const PROVIDERS={
  'Stream-Promotion':{logo:'SP', desc:'스트리밍 전문 · 라이브 시청자', main:true},
  'smmwiz':          {logo:'WZ', desc:'올라운더 · 네이버/카카오 트래픽·성별', main:true},
  'major':           {logo:'MJ', desc:'틱톡 · 한국 페북 전기능', main:true},
  'rezz':            {logo:'RZ', desc:'스포티파이 · 인스타 한국 품질'},
  'JAP':             {logo:'JAP',desc:'해외 대량 · 인스타/유튜브/틱톡'},
  'morethan':        {logo:'MT', desc:'틱톡댓글 · 유튜브SEO · 스포티파이'},
  'n1panel':         {logo:'N1', desc:'텔레그램 · 쿠팡/무신사 트래픽'},
  'Peakerr':         {logo:'PK', desc:'해외 성별타겟 · 커스텀댓글'},
  'SMB Panel':       {logo:'SMB',desc:'종합 SNS · 웹트래픽·물량'},
  'RealSite':        {logo:'RS', desc:'한국 특화 · 인스타·좋아요'},
  'SMMVALY':         {logo:'VL', desc:'결제·세금계산서·차일드패널'},
  'allsmm':          {logo:'AL', desc:'글로벌 보조'},
};
let BAL={}; // 공급처별 현재 잔액(USD) — 충전 낙관적 반영용
function esc2(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
/* 공급처 잔액 카드(동적) — 공급처 많아져도 한 줄 compact + 섹션 접기/펴기 */
function renderProviders(){
  const box=document.getElementById('providerList'); if(!box)return;
  const pn=document.getElementById('aProvN'); if(pn)pn.textContent=Object.keys(PROVIDERS).length;
  box.innerHTML=Object.entries(PROVIDERS).map(([name,p])=>
    `<div class="provider" data-prov="${esc2(name)}">
       <div class="providerlogo">${esc2(p.logo)}</div>
       <div class="provider-name"><h3>${esc2(name)}${p.main?' <span class="prov-main">주력</span>':''}</h3><p>${esc2(p.desc)}</p></div>
       <strong class="bal-v" data-bal="${esc2(name)}">—</strong>
       <button class="recharge" onclick="openRecharge('${esc2(name).replace(/'/g,"\\'")}')">충전</button>
     </div>`).join('');
}
function toggleProviders(){
  const box=document.getElementById('providerList'), btn=document.getElementById('provToggle'); if(!box)return;
  const collapsed=box.classList.toggle('collapsed');
  if(btn){btn.textContent=collapsed?'펴기 ▼':'접기 ▲'; btn.setAttribute('aria-expanded', String(!collapsed));}
}
function paintBal(name){
  const el=document.querySelector(`.bal-v[data-bal="${CSS.escape(name)}"]`); if(!el)return;
  const v=BAL[name];
  el.innerHTML = (v!=null&&isFinite(v)) ? `$${Number(v).toFixed(2)} <small>USD</small>` : '<span class="bal-off">미연결</span>';
  const card=el.closest('.provider'); if(card)card.classList.toggle('low', v!=null&&v<10); // 10달러 미만 경고
}
async function loadBalances(){
  if(!document.getElementById('providerList').children.length) renderProviders();
  document.querySelectorAll('.bal-v').forEach(el=>el.innerHTML='…');
  try{
    const r=await fetch(API_BASE+'/api/balance',{cache:'no-store'});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const d=await r.json();
    Object.keys(PROVIDERS).forEach(n=>{ const o=d[n]; BAL[n]=(o&&o.balance!=null)?Number(o.balance):null; paintBal(n); });
    toast('공급처 잔액을 불러왔습니다');
  }catch(e){
    Object.keys(PROVIDERS).forEach(n=>{ BAL[n]=null; paintBal(n); });
    toast('백엔드(/api/balance) 연결 전입니다 — Vercel 배포 후 작동');
  }
}

/* ===== 공급처 충전(관리자) ===== */
const RC_RATE=1400;
let rcProvider='Stream-Promotion', rcUsd=100, rcPay='card';
function rcHistKey(){return 'supply_recharge';}
function rcLoadHist(){try{return JSON.parse(localStorage.getItem(rcHistKey())||'[]');}catch(e){return[];}}
function rcSaveHist(h){try{localStorage.setItem(rcHistKey(),JSON.stringify(h.slice(0,30)));}catch(e){}}
function openRecharge(name){
  rcProvider=name; rcUsd=100; rcPay='card';
  document.getElementById('rcName').textContent=name;
  document.getElementById('rcLogo').textContent=(PROVIDERS[name]||{}).logo||'SP';
  const cur=BAL[name];
  document.getElementById('rcCur').textContent=(cur!=null&&isFinite(cur))?`$${cur.toFixed(2)}`:'— (불러오기 필요)';
  // 금액/결제 기본 선택 리셋
  document.querySelectorAll('#rcAmts button').forEach(b=>b.classList.toggle('on',+b.dataset.usd===100));
  document.querySelectorAll('#rcPays button').forEach(b=>b.classList.toggle('on',b.dataset.pay==='card'));
  document.getElementById('rcCustom').value='';
  rcCalc(); rcRenderHist();
  document.getElementById('rechargeModal').classList.add('show');
}
function closeRecharge(){document.getElementById('rechargeModal').classList.remove('show');}
function rcCalc(){
  const cur=BAL[rcProvider];
  document.getElementById('rcSumUsd').textContent=`$${rcUsd.toFixed(2)}`;
  document.getElementById('rcSumKrw').textContent='₩'+Math.round(rcUsd*RC_RATE).toLocaleString('ko-KR');
  document.getElementById('rcSumAfter').textContent=(cur!=null&&isFinite(cur))?`$${(cur+rcUsd).toFixed(2)}`:`+$${rcUsd.toFixed(2)}`;
}
function rcRenderHist(){
  const box=document.getElementById('rcHist'); if(!box)return;
  const h=rcLoadHist().filter(x=>x.name===rcProvider).slice(0,4);
  if(!h.length){box.innerHTML='';return;}
  box.innerHTML='<div class="rc-hist-h">최근 충전 요청</div>'+h.map(x=>
    `<div class="rc-hist-row"><span>${x.date}</span><b>$${Number(x.usd).toFixed(0)}</b><span class="rc-tag">${x.pay}</span><span class="rc-st">요청됨</span></div>`).join('');
}
function submitRecharge(){
  if(!(rcUsd>0)){toast('충전 금액을 입력하세요');return;}
  const now=new Date(); const date=`${(now.getMonth()+1)}/${now.getDate()} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const payLbl={card:'카드',usdt:'USDT',wire:'송금'}[rcPay]||rcPay;
  const h=rcLoadHist(); h.unshift({name:rcProvider,usd:rcUsd,pay:payLbl,date}); rcSaveHist(h);
  // 낙관적 반영(입금 확인 전 데모) — 잔액 즉시 더해 보여줌
  if(BAL[rcProvider]!=null&&isFinite(BAL[rcProvider])){ BAL[rcProvider]+=rcUsd; paintBal(rcProvider); }
  rcRenderHist();
  const cur=BAL[rcProvider];
  document.getElementById('rcCur').textContent=(cur!=null&&isFinite(cur))?`$${cur.toFixed(2)}`:'—';
  toast(`${rcProvider} $${rcUsd.toLocaleString('en-US')} 충전 요청 완료`);
}
// 금액/결제 버튼 + 직접입력
document.getElementById('rcAmts').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  rcUsd=+b.dataset.usd; document.getElementById('rcCustom').value='';
  document.querySelectorAll('#rcAmts button').forEach(x=>x.classList.toggle('on',x===b)); rcCalc();});
document.getElementById('rcCustom').addEventListener('input',e=>{const v=+e.target.value;
  if(v>0){rcUsd=v; document.querySelectorAll('#rcAmts button').forEach(x=>x.classList.remove('on')); rcCalc();}});
document.getElementById('rcPays').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  rcPay=b.dataset.pay; document.querySelectorAll('#rcPays button').forEach(x=>x.classList.toggle('on',x===b));});
document.getElementById('rechargeModal').addEventListener('click',e=>{if(e.target.id==='rechargeModal')closeRecharge();});
let timer;
function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>el.classList.remove('show'),2200);}

/* 뷰 전환 (FlowDesk 셸 연결) */
function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
  const navId = id==='catpage' ? 'store' : id;
  if(window._buildNav)window._buildNav(navId);
  const bc=document.getElementById('breadcrumb');
  if(bc)bc.textContent={store:'서비스몰',order:'빠른주문',reseller:'파트너·API',wallet:'지갑',admin:'관리자'}[navId]||'서비스몰';
  if(id==='store'&&typeof renderShowcase==='function')renderShowcase();
  if(id==='order'&&typeof renderOrderView==='function'){try{renderOrderView();}catch(e){console.warn('[빠른주문]',e.message);}}
  if(id==='admin'&&typeof adminRender==='function'){try{fillAdminSelects();adminRender();if(typeof bindAdmAccordion==='function')bindAdmAccordion();}catch(e){console.warn('[관리자] 렌더 오류',e.message);}}
  if(id==='wallet'&&typeof renderOrders==='function'){try{renderOrders();}catch(e){}}
  window.scrollTo({top:0,behavior:'smooth'});
}

/* 관리자: 로고 7번 클릭 핸들러는 프리앰블(.logo)에서 처리 */
const ADMIN_PW='123456';
function openAdmin(){
  const m=document.getElementById('adminModal');
  m.classList.add('show');
  document.getElementById('adminErr').textContent='';
  const pw=document.getElementById('adminPw');pw.value='';setTimeout(()=>pw.focus(),50);
}
function closeAdmin(){document.getElementById('adminModal').classList.remove('show');}
function adminLogin(){
  const pw=document.getElementById('adminPw').value.trim();
  if(pw===ADMIN_PW){
    closeAdmin();
    showView('admin');
    try{renderProviders();}catch(e){}  // 공급처 잔액 카드 동적 생성
    try{loadBalances();}catch(e){}  // 진입 시 공급처 잔액 자동 로드
    toast('관리자 콘솔에 입장했습니다');
  }else{
    document.getElementById('adminErr').textContent='비밀번호가 올바르지 않습니다';
    const pwi=document.getElementById('adminPw');pwi.value='';pwi.focus();
  }
}
function adminLogout(){showView('store');toast('관리자 콘솔에서 나왔습니다');}
/* 모달 바깥 클릭 닫기 */
document.getElementById('adminModal').addEventListener('click',e=>{if(e.target.id==='adminModal')closeAdmin();});

/* ===== 로그인 / 회원가입 모달 ===== */
function openAuth(mode){
  document.getElementById('authModal').classList.add('show');
  switchAuth(mode||'login');
  const em=document.getElementById('authEmail');setTimeout(()=>em.focus(),50);
}
function closeAuth(){document.getElementById('authModal').classList.remove('show');}
function switchAuth(mode){
  const box=document.querySelector('#authModal .auth-box');
  box.classList.toggle('signup',mode==='signup');
  document.querySelectorAll('.auth-tab').forEach(t=>t.classList.toggle('active',t.dataset.auth===mode));
  document.getElementById('authTitle').textContent=mode==='signup'?'떡상 시작하기 🚀':'다시 오셨네요 👋';
  document.getElementById('authDesc').textContent=mode==='signup'?'1분이면 가입 끝, 바로 충전하고 주문하세요.':'로그인하고 떡상을 이어가세요.';
  document.getElementById('authGo').textContent=mode==='signup'?'회원가입':'로그인';
  document.getElementById('authErr').textContent='';
}
function submitAuth(){
  const signup=document.querySelector('#authModal .auth-box').classList.contains('signup');
  const email=document.getElementById('authEmail').value.trim();
  const pw=document.getElementById('authPw2').value;
  const err=document.getElementById('authErr');
  if(!email||!/.+@.+\..+/.test(email)){err.textContent='올바른 이메일을 입력해 주세요';return;}
  if(pw.length<6){err.textContent='비밀번호는 6자 이상이어야 합니다';return;}
  if(signup){
    if(pw!==document.getElementById('authPw3').value){err.textContent='비밀번호가 일치하지 않습니다';return;}
    if(!document.getElementById('authAgree').checked){err.textContent='약관에 동의해 주세요';return;}
    closeAuth();showView('wallet');toast('회원가입 완료(시안)! 충전하고 떡상 시작하세요');
  }else{
    closeAuth();showView('wallet');toast('로그인 완료(시안)!');
  }
}
document.getElementById('authModal').addEventListener('click',e=>{if(e.target.id==='authModal')closeAuth();});

/* ===== 주문 모달 ===== */
const won=n=>'₩'+Math.round(n).toLocaleString('ko-KR');
let odData=null;
/* 상품 상세 모달 */
let detailEl=null;
function openDetail(el){
  detailEl=el; const d=el.dataset;
  const ic=document.getElementById('dtIcon'); ic.textContent=d.icon; ic.className='omodal-ic '+d.iconcls;
  document.getElementById('dtName').textContent=d.name;
  document.getElementById('dtPlat').innerHTML=`<i class="sourcedot"></i>플랫폼 <span>${d.platform||d.plat||''}</span>`;
  document.getElementById('dtPer1').textContent=per1(+d.price);
  document.getElementById('dtPer1k').innerHTML=`<span>1,000${d.unit}당 ₩${(+d.price).toLocaleString('ko-KR')}</span>`;
  document.getElementById('dtChips').innerHTML=
    `<span class="meta">최소 ${(+d.min).toLocaleString('ko-KR')}${d.unit}</span>`+
    `<span class="meta">최대 ${(+d.max).toLocaleString('ko-KR')}${d.unit}</span>`+
    `<span class="meta">${d.refill}</span>`+`<span class="meta">1개 단위 주문</span>`;
  document.getElementById('dtDesc').textContent=d.desc||el.querySelector('.prow-sub')?.textContent||'';
  document.getElementById('dtInfo').innerHTML=
    `<div class="di"><label>최소 주문</label><b>${(+d.min).toLocaleString('ko-KR')}${d.unit}</b></div>`+
    `<div class="di"><label>최대 주문</label><b>${(+d.max).toLocaleString('ko-KR')}${d.unit}</b></div>`+
    `<div class="di"><label>예상 시작</label><b>${d.start}</b></div>`+
    `<div class="di"><label>리필</label><b>${d.refill}</b></div>`;
  document.getElementById('detailModal').classList.add('show');
}
function closeDetail(){const m=document.getElementById('detailModal');if(m)m.classList.remove('show');}
function detailToOrder(){ if(detailEl)openOrder(detailEl); }

/* 종류(group)별 주문 입력 — 잘되는 패널 벤치마크: 무엇을 어디에 넣는지가 종류마다 다름 */
const ORDER_INPUT={
  팔로워:{label:'계정 아이디 / 프로필 주소',hint:'공개 계정이어야 해요(비공개 불가). @아이디 또는 프로필 링크를 넣어주세요.'},
  구독자:{label:'채널 주소',hint:'구독자를 받을 공개 채널 링크를 넣어주세요.'},
  좋아요:{label:'게시물 주소',hint:'좋아요 받을 게시물의 공개 링크(비공개·삭제 시 작업 불가).'},
  댓글:{label:'게시물 주소',hint:'댓글이 달릴 게시물의 공개 링크를 넣어주세요.'},
  조회수:{label:'영상 주소',hint:'조회수를 올릴 영상의 공개 링크를 넣어주세요.'},
  재생:{label:'트랙 주소',hint:'재생수를 올릴 음원/플레이리스트 링크를 넣어주세요.'},
  시청자:{label:'라이브 주소',hint:'진행 중인 라이브 방송 링크를 넣어주세요(방송 중에만 유입).'},
  멤버:{label:'그룹 / 채널 주소',hint:'멤버를 받을 공개 그룹·채널 초대 링크를 넣어주세요.'},
  공유:{label:'게시물 주소',hint:'공유될 게시물의 공개 링크를 넣어주세요.'},
  트래픽:{label:'유입시킬 페이지 주소',hint:'🔑 검색 유입 상품은 키워드도 중요해요(상세 설명 참고). 유입시킬 페이지 링크를 넣어주세요.'},
  기타:{label:'주문 주소',hint:'작업할 공개 링크를 넣어주세요.'},
};
/* 종류(group)별 상품 상세설명 — 인스타몬스터식: 개요(o)·주요특징(f)·주문전안내(w) */
const ORDER_GUIDE={
  팔로워:{o:'실제 유저 기반으로 계정 팔로워를 늘려 신뢰도와 노출을 높입니다.',f:['자연스러운 유입 속도로 안전','계정 신뢰도·검색 노출 상승','브랜드·개인 계정 모두 효과'],w:['작업 중 계정을 비공개로 바꾸지 마세요','아이디 변경 시 작업이 멈출 수 있어요','진행 중 주문 완료 후 재주문하세요']},
  구독자:{o:'채널 구독자를 늘려 노출과 신뢰도를 높입니다.',f:['채널 성장·추천 노출에 유리','수익화 조건 달성에 도움'],w:['공개 채널이어야 합니다','채널 주소(핸들/URL)를 정확히 입력하세요']},
  좋아요:{o:'게시물 좋아요를 늘려 참여율과 추천 노출을 높입니다.',f:['빠른 반영으로 초기 반응 부스트','탐색·추천 노출 유리'],w:['비공개·삭제 시 작업 불가','게시물 링크를 정확히 입력하세요']},
  댓글:{o:'실제 반응형 댓글로 게시물 신뢰도를 높입니다.',f:['자연스러운 주제 기반 댓글','참여 지표 상승'],w:['댓글 수정·삭제·환불 불가','소량 테스트 후 이용을 권장합니다']},
  조회수:{o:'영상 조회수를 늘려 추천·인기 노출에 유리하게 합니다.',f:['빠른 조회수 유입','알고리즘 도달·노출 상승'],w:['공개 영상 링크여야 합니다','작업 중 영상 삭제 금지']},
  재생:{o:'음원 재생수를 늘려 차트·추천에 유리하게 합니다.',f:['스트리밍 지표 상승','추천·플레이리스트 노출'],w:['공개 트랙 링크가 필요합니다']},
  시청자:{o:'라이브 방송에 실시간 시청자를 유입합니다.',f:['방송 순위·추천 노출 상승','실시간 활기 연출'],w:['방송이 켜져 있을 때만 작동','방송 시작 후 주문하세요']},
  멤버:{o:'그룹·채널 멤버를 늘려 활성도를 높입니다.',f:['커뮤니티 규모·신뢰도 상승'],w:['공개 초대 링크가 필요합니다','가입 제한 설정을 해제하세요']},
  공유:{o:'게시물 공유로 확산·노출을 높입니다.',f:['도달·확산 상승'],w:['공개 게시물이어야 합니다']},
  트래픽:{o:'검색·외부 경로로 실제 페이지 방문을 유입합니다.',f:['검색/추천 지표 개선','실제 방문 기반'],w:['검색 유입은 키워드가 중요합니다(아래 입력)','유입시킬 페이지를 공개 상태로 두세요']},
  기타:{o:'상품 설명을 확인하고 주문해 주세요.',f:[],w:['공개 링크를 정확히 입력하세요']},
};
/* 플랫폼(한글 plat명)별 허용 링크 호스트 — 아무 글자나 넣는 오주문 방지 */
const LINK_HOST={
  인스타그램:/instagram\.com|instagr\.am/i,
  틱톡:/tiktok\.com|vt\.tiktok/i,
  유튜브:/youtube\.com|youtu\.be/i,
  트위치:/twitch\.tv/i,
  킥:/kick\.com/i,
  텔레그램:/t\.me|telegram\.(me|org|dog)/i,
  스포티파이:/spotify\.com|spoti\.fi/i,
  페이스북:/facebook\.com|fb\.(com|watch|me)/i,
  디스코드:/discord\.(gg|com)|discordapp\.com/i,
  'X(트위터)':/twitter\.com|x\.com/i,
  트위터:/twitter\.com|x\.com/i,
  스레드:/threads\.net/i,
  네이버:/naver\.(com|me)/i,
  카카오:/kakao\.com|kakaocorp|pf\.kakao|open\.kakao/i,
  치지직:/chzzk\.naver\.com/i,
  '숲(아프리카)':/sooplive\.co\.kr|afreeca(tv)?\.com|bj\.afreeca/i,
  레딧:/reddit\.com|redd\.it/i,
  스냅챗:/snapchat\.com/i,
  사운드클라우드:/soundcloud\.com|snd\.sc/i,
  럼블:/rumble\.com/i,
  브콘탁테:/vk\.com|vk\.ru/i,
  라이키:/likee\.(com|video)/i,
  콰이:/kuaishou\.com|kwai\.com/i,
  왓츠앱:/whatsapp\.com|wa\.me|chat\.whatsapp/i,
  쇼피:/shopee\./i,
  라자다:/lazada\./i,
  와일드베리:/wildberries\./i,
  붐플레이:/boomplay\.com/i,
  웹트래픽:/^https?:\/\//i,
};
/* @아이디·핸들만 넣어도 되는 종류(전체 URL 불필요) */
const ID_KINDS=['팔로워','구독자','멤버'];
const ID_RX=/^@?[\w.가-힣-]{2,}$/;
/* 종류별 "링크 얻는 법" 단계 — 처음 쓰는 사람도 따라하게 */
const LINK_STEP={
  팔로워:['대상 프로필 화면을 엽니다.','상단 아이디(@뒤 글자)를 쓰거나, [공유]→[링크 복사]로 프로필 주소를 복사합니다.','아래 칸에 붙여넣습니다.'],
  구독자:['채널 홈을 엽니다.','핸들(@채널명) 또는 채널 URL을 복사합니다.','아래 칸에 붙여넣습니다.'],
  좋아요:['좋아요를 받을 게시물을 엽니다.','[···] 또는 [공유]→[링크 복사]를 누릅니다.','복사된 게시물 주소를 붙여넣습니다.'],
  댓글:['댓글을 받을 게시물을 엽니다.','[···] 또는 [공유]→[링크 복사]를 누릅니다.','복사된 게시물 주소를 붙여넣습니다.'],
  공유:['공유될 게시물을 엽니다.','[공유]→[링크 복사]를 누릅니다.','복사된 게시물 주소를 붙여넣습니다.'],
  조회수:['조회수를 올릴 영상을 엽니다.','[공유]→[링크 복사]를 누릅니다(youtu.be/… 형태 가능).','복사된 영상 주소를 붙여넣습니다.'],
  재생:['대상 트랙/플레이리스트를 엽니다.','[···]→[공유]→[링크 복사]를 누릅니다.','복사된 주소를 붙여넣습니다.'],
  시청자:['라이브 방송을 먼저 켭니다.','방송 중인 화면의 주소(URL)를 복사합니다.','아래 칸에 붙여넣습니다. (방송 중에만 유입)'],
  멤버:['그룹/채널의 초대 링크를 엽니다(t.me/…, discord.gg/… 등).','초대 링크를 복사합니다.','아래 칸에 붙여넣습니다.'],
  트래픽:['유입시킬 페이지(https://…) 주소를 복사합니다.','아래 링크 칸에 붙여넣습니다.','🔑 검색 키워드 칸도 함께 채웁니다.'],
  기타:['상품 설명을 확인합니다.','작업 대상의 공개 주소(https://…)를 복사합니다.','아래 칸에 붙여넣습니다.'],
};
/* 링크 형식 검증: URL 호스트 일치 또는 (ID 종류일 때) @아이디 형식이면 통과 */
function linkValid(link){
  if(!odData)return true;
  const host=LINK_HOST[odData.plat];
  const urlOk=host?host.test(link):/^https?:\/\//i.test(link);
  const idOk=ID_KINDS.includes(odData.kind)&&!/\s/.test(link)&&ID_RX.test(link);
  return urlOk||idOk;
}
function openLinkGuide(){
  if(!odData)return;
  const plat=odData.plat||'', kind=odData.kind||'기타';
  const steps=LINK_STEP[kind]||LINK_STEP.기타;
  const ex=PH[plat]||odData.ph||'';
  const idNote=ID_KINDS.includes(kind)?`<div class="lg-note">💡 <b>${esc(plat)} ${esc(kind)}</b>는 전체 주소 대신 <b>@아이디</b>만 넣어도 돼요.</div>`:'';
  document.getElementById('lgTitle').textContent=`${plat} ${kind} · 링크 입력 방법`;
  document.getElementById('lgBody').innerHTML=
    steps.map((s,i)=>`<div class="lg-step"><span class="lg-n">${i+1}</span><span>${esc(s)}</span></div>`).join('')+
    idNote+
    (ex?`<div class="lg-ex"><label>입력 예시</label><code>${esc(ex)}</code></div>`:'');
  document.getElementById('linkGuideModal').classList.add('show');
}
function closeLinkGuide(){const m=document.getElementById('linkGuideModal');if(m)m.classList.remove('show');}
function openOrder(btn){
  const c=btn.closest('.card')||btn.closest('.prow')||btn;const d=c.dataset;
  closeDetail();
  odData={price:+d.price,min:+d.min,max:+d.max,unit:d.unit,plat:d.platform||'',kind:d.kind||'',ph:d.ph||'',icon:d.icon||'',iconcls:d.iconcls||''};
  // 헤더
  const ic=document.getElementById('odIcon');
  ic.textContent=d.icon;ic.className='omodal-ic '+d.iconcls;
  document.getElementById('odName').textContent=d.name;
  document.getElementById('odSource').textContent=d.platform;   // 공급처 대신 플랫폼(고객에겐 공급처 숨김)
  // 칩(메타)
  document.getElementById('odChips').innerHTML=
    `<span class="meta">최소 ${(+d.min).toLocaleString('ko-KR')}${d.unit}</span>`+
    `<span class="meta">최대 ${(+d.max).toLocaleString('ko-KR')}${d.unit}</span>`+
    `<span class="meta">${d.refill}</span>`+
    `<span class="meta">1개 단위 주문</span>`;
  // 상품 상세설명(종류별 개요·특징·주문전안내·주문방법)
  const g=ORDER_GUIDE[d.kind]||ORDER_GUIDE.기타;
  const spec=ORDER_INPUT[d.kind]||ORDER_INPUT.기타;
  const og=document.getElementById('odGuide');
  if(og){
    let h=`<div class="og-sec"><b>🔆 서비스 개요</b><p>${esc(g.o)}</p></div>`;
    if(g.f&&g.f.length)h+=`<div class="og-sec"><b>⏩ 주요 특징</b>${g.f.map(t=>`<div class="og-li">· ${esc(t)}</div>`).join('')}</div>`;
    if(g.w&&g.w.length)h+=`<div class="og-sec"><b>⚙️ 주문 전 안내</b>${g.w.map(t=>`<div class="og-li">※ ${esc(t)}</div>`).join('')}</div>`;
    h+=`<div class="og-sec"><b>🔤 주문 방법</b><div class="og-li">1. <b>${esc(spec.label)}</b>${d.kind==='트래픽'?' + 🔑검색 키워드':''} 입력</div><div class="og-li">2. 수량 선택 후 주문</div>${d.ph?`<div class="og-ex">예시: ${esc(d.ph)}</div>`:''}</div>`;
    og.innerHTML=h;
  }
  // 링크 — 종류(group)별 맞춤 라벨/안내
  const ll=document.getElementById('odLinkLabel'); if(ll)ll.textContent='🔗 '+spec.label;
  const lh=document.getElementById('odLinkHint'); if(lh)lh.textContent=spec.hint;
  const link=document.getElementById('odLink');link.value='';link.placeholder=d.ph;
  // 트래픽(검색 유입)만 키워드칸 표시
  const kw=document.getElementById('odKeywordWrap'); if(kw)kw.style.display=(d.kind==='트래픽')?'block':'none';
  const kwi=document.getElementById('odKeyword'); if(kwi)kwi.value='';
  // 수량 슬라이더/입력 — 1개 단위, 기본값=최소수량(상품마다 min/max 다름)
  const range=document.getElementById('odQty'),num=document.getElementById('odQtyNum');
  range.min=d.min;range.max=d.max;range.step=1;
  const start=+d.min;
  range.value=start;num.value=start;num.min=d.min;num.max=d.max;num.step=1;
  document.getElementById('odUnit').textContent=d.unit;
  document.getElementById('odRange').textContent=`(최소 ${(+d.min).toLocaleString('ko-KR')} ~ 최대 ${(+d.max).toLocaleString('ko-KR')}${d.unit} · 1개 단위)`;
  // 요약
  document.getElementById('odUnitPrice').textContent=per1(+d.price)+'/1'+d.unit+' (1,000당 '+won(d.price)+')';
  document.getElementById('odStart').textContent=d.start;
  document.getElementById('odRefill').textContent=d.refill;
  calcOrder();
  document.getElementById('orderModal').classList.add('show');
  if(typeof logLine==='function')logLine('info','상품 선택: '+(d.name||'')+' ('+(d.platform||'')+'·'+(d.kind||'')+')');
}
function closeOrder(){document.getElementById('orderModal').classList.remove('show');}
function clampQty(v){if(!odData)return 0;v=Math.round(v||0);return Math.max(odData.min,Math.min(odData.max,v));}
function calcOrder(){
  if(!odData)return;
  const q=clampQty(+document.getElementById('odQtyNum').value);
  document.getElementById('odTotal').textContent=won(odData.price*q/1000);
}
// 슬라이더 ↔ 숫자 동기화
document.getElementById('odQty').addEventListener('input',e=>{
  document.getElementById('odQtyNum').value=e.target.value;calcOrder();
});
document.getElementById('odQtyNum').addEventListener('input',e=>{
  const q=clampQty(+e.target.value);document.getElementById('odQty').value=q;calcOrder();
});
document.getElementById('odQtyNum').addEventListener('blur',e=>{
  const q=clampQty(+e.target.value);e.target.value=q;document.getElementById('odQty').value=q;calcOrder();
});
function submitOrder(){
  const link=document.getElementById('odLink').value.trim();
  if(!link){toast('링크를 입력해 주세요');document.getElementById('odLink').focus();return;}
  if(!linkValid(link)){
    toast('⚠️ 링크 형식이 올바르지 않아요 — 입력 방법을 확인해 주세요');
    document.getElementById('odLink').focus();
    openLinkGuide();
    if(typeof logLine==='function')logLine('warn','링크 형식 불일치: '+(odData.plat||'')+'·'+(odData.kind||'')+' / '+link.slice(0,40));
    return;
  }
  var kwWrap=document.getElementById('odKeywordWrap');
  if(kwWrap&&kwWrap.style.display==='block'&&!document.getElementById('odKeyword').value.trim()){toast('검색 키워드를 입력해 주세요');document.getElementById('odKeyword').focus();return;}
  const q=clampQty(+document.getElementById('odQtyNum').value);
  var onm=(document.getElementById('odName')||{}).textContent||'';
  closeOrder();
  toast(`✅ 주문 완료 — ${onm} ${odData.unit} ${q.toLocaleString('ko-KR')} · ${won(odData.price*q/1000)}`);
  if(typeof logLine==='function')logLine('ok','주문 접수: '+onm+' / '+odData.unit+' '+q.toLocaleString('ko-KR')+' / '+won(odData.price*q/1000)+' / 링크 '+link.slice(0,40));
  if(typeof addOrder==='function')addOrder({id:'ORD'+Date.now(), name:onm, unit:odData.unit, qty:q, total:odData.price*q/1000, link:link, kw:(kwWrap&&kwWrap.style.display==='block')?document.getElementById('odKeyword').value.trim():'', status:'대기', date:new Date().toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})});
  // 주문 후 지갑 > 주문 내역으로 이동해 방금 주문 바로 보이게
  if(typeof showView==='function')showView('wallet');
  setTimeout(function(){var ob=document.querySelector('.wtab-btn[data-wtab="orders"]');if(ob)ob.click();},120);
}
document.getElementById('orderModal').addEventListener('click',e=>{if(e.target.id==='orderModal')closeOrder();});
document.getElementById('detailModal').addEventListener('click',e=>{if(e.target.id==='detailModal')closeDetail();});

/* ===== ⚡ 빠른 주문 (New Order, PerfectPanel식) — 기존 odData·linkValid·addOrder 재사용 ===== */
function noLive(){return CAT.filter(c=>!c.broken&&(typeof LIVE==='undefined'||!LIVE||!LIVE.has||LIVE.has(c.id)));}
function renderOrderView(){
  const sel=document.getElementById('noPlat'); if(!sel)return;
  const byPlat={}; noLive().forEach(c=>{byPlat[c.plat]=(byPlat[c.plat]||0)+1;});
  const plats=Object.entries(byPlat).sort((a,b)=>b[1]-a[1]);
  if(!plats.length){sel.innerHTML='';document.getElementById('noDetail').innerHTML='<div class="no-empty">공개된 상품이 없어요. 관리자에서 상품을 공개해 주세요.</div>';return;}
  sel.innerHTML=plats.map(([p,n])=>`<option value="${esc(p)}">${esc(p)} (${n.toLocaleString('ko-KR')})</option>`).join('');
  noPlatChange();
}
function noPlatChange(){
  const plat=document.getElementById('noPlat').value;
  const kinds=[...new Set(noLive().filter(c=>c.plat===plat).map(c=>c.group))];
  document.getElementById('noKind').innerHTML=kinds.map(k=>`<option value="${esc(k)}">${esc(k)}</option>`).join('');
  noKindChange();
}
function noKindChange(){
  const plat=document.getElementById('noPlat').value, kind=document.getElementById('noKind').value;
  const svs=noLive().filter(c=>c.plat===plat&&c.group===kind).sort((a,b)=>priceOf(a)-priceOf(b));
  document.getElementById('noService').innerHTML=svs.map(c=>`<option value="${esc(c.id)}">${esc(c.ko)} — ${per1(priceOf(c))}/1${unitOf(c)}</option>`).join('');
  noServiceChange();
}
function noServiceChange(){
  const id=document.getElementById('noService').value;
  const c=CAT.find(x=>x.id===id); if(!c)return;
  const unit=unitOf(c), pr=priceOf(c);
  odData={price:pr,min:+c.min,max:+c.max,unit:unit,plat:c.plat,kind:c.group,ph:phOf(c),icon:c.ic,iconcls:clsOf(c)};
  const spec=ORDER_INPUT[c.group]||ORDER_INPUT.기타;
  document.getElementById('noLinkLabel').textContent='🔗 '+spec.label;
  document.getElementById('noLinkHint').textContent=spec.hint;
  const link=document.getElementById('noLink'); link.placeholder=phOf(c);
  document.getElementById('noKeywordWrap').style.display=(c.group==='트래픽')?'block':'none';
  const kwi=document.getElementById('noKeyword'); if(kwi)kwi.value='';
  const q=document.getElementById('noQty'); q.min=c.min;q.max=c.max;q.step=1;q.value=c.min;
  document.getElementById('noRange').textContent=`(최소 ${(+c.min).toLocaleString('ko-KR')} ~ 최대 ${(+c.max).toLocaleString('ko-KR')}${unit} · 1개 단위)`;
  document.getElementById('noUnitPrice').textContent=per1(pr)+'/1'+unit+' (1,000당 '+won(pr)+')';
  document.getElementById('noStart').textContent='0~수 시간';
  // 상세 패널(종류별 가이드)
  const g=ORDER_GUIDE[c.group]||ORDER_GUIDE.기타, refillTxt=c.refill?'리필 포함':'리필 미포함';
  let h=`<div class="nod-head"><div class="omodal-ic ${clsOf(c)}">${esc(c.ic)}</div><div><h3>${esc(c.ko)}</h3><div class="nod-plat">${esc(c.plat)} · ${esc(c.group)}</div></div></div>`;
  h+=`<div class="nod-chips"><span class="meta">최소 ${(+c.min).toLocaleString('ko-KR')}${unit}</span><span class="meta">최대 ${(+c.max).toLocaleString('ko-KR')}${unit}</span><span class="meta">${refillTxt}</span><span class="meta">${c.premium?'🇰🇷 한국인':esc((c.flag||'')+' '+(c.geo||''))}</span></div>`;
  h+=`<div class="nod-id">대량주문용 상품 ID <code>${esc(c.id)}</code><button type="button" class="nod-copy" onclick="copyNodId('${esc(c.id)}')">복사</button></div>`;
  h+=`<div class="og-sec"><b>🔆 서비스 개요</b><p>${esc(g.o)}</p></div>`;
  if(g.f&&g.f.length)h+=`<div class="og-sec"><b>⏩ 주요 특징</b>${g.f.map(t=>`<div class="og-li">· ${esc(t)}</div>`).join('')}</div>`;
  if(g.w&&g.w.length)h+=`<div class="og-sec"><b>⚙️ 주문 전 안내</b>${g.w.map(t=>`<div class="og-li">※ ${esc(t)}</div>`).join('')}</div>`;
  document.getElementById('noDetail').innerHTML=h;
  var _dr=document.getElementById('noDripRow');
  if(_dr){var _sup=!!c.dripfeed;_dr.style.display=_sup?'block':'none';if(!_sup){var _dc=document.getElementById('noDrip');if(_dc)_dc.checked=false;var _do=document.getElementById('noDripOpts');if(_do)_do.style.display='none';}}
  noCalc();
}
function noClamp(){const q=document.getElementById('noQty');let v=Math.round(+q.value||0);if(odData)v=Math.max(odData.min,Math.min(odData.max,v));return v;}
function noCalc(){if(!odData)return;const q=noClamp();document.getElementById('noTotal').textContent=won(odData.price*q/1000);if(typeof noDripHint==='function')noDripHint();}
function noDripToggle(){var on=document.getElementById('noDrip').checked;document.getElementById('noDripOpts').style.display=on?'block':'none';noDripHint();}
function noDripHint(){var t=document.getElementById('noDripHintTxt');if(!t||!odData)return;var q=noClamp();var runs=Math.max(2,+document.getElementById('noDripRuns').value||10);var per=Math.floor(q/runs);var iv=+document.getElementById('noDripInterval').value||30;t.textContent='총 '+q.toLocaleString('ko-KR')+odData.unit+'을 '+runs+'회 × 약 '+per.toLocaleString('ko-KR')+odData.unit+'씩, '+iv+'분 간격으로 나눠 발송합니다.';}
function submitSubscription(){
  var acc=document.getElementById('subAccount').value.trim();
  if(!acc){toast('계정 주소를 입력해 주세요');document.getElementById('subAccount').focus();return;}
  if(!/^https?:\/\//i.test(acc)&&!/^@?[\w.가-힣-]{2,}$/.test(acc)){toast('계정 주소 형식을 확인해 주세요 (URL 또는 @아이디)');return;}
  var sq=Math.round(+document.getElementById('subQty').value||0), sd=Math.round(+document.getElementById('subDays').value||30);
  if(!sq){toast('게시물당 수량을 입력해 주세요');return;}
  var plat=odData?odData.plat:'';
  if(typeof addOrder==='function')addOrder({id:'SUB'+Date.now(),name:'🔁 구독 — '+(plat?plat+' ':'')+'게시물당 '+sq.toLocaleString('ko-KR'),unit:'회/글',qty:sq,total:0,link:acc,kw:'',status:'진행중',sub:{days:sd,qty:sq},date:new Date().toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})});
  if(typeof logLine==='function')logLine('ok','구독 시작: '+acc+' / 게시물당 '+sq+' / '+sd+'일');
  toast('🔁 구독이 시작됐어요 — 새 게시물마다 자동 주문됩니다');
  document.getElementById('subAccount').value='';
  if(typeof showView==='function')showView('wallet');
  setTimeout(function(){var ob=document.querySelector('.wtab-btn[data-wtab="orders"]');if(ob)ob.click();},120);
}
function submitNewOrder(){
  if(!odData){toast('상품을 먼저 선택해 주세요');return;}
  const link=document.getElementById('noLink').value.trim();
  if(!link){toast('링크를 입력해 주세요');document.getElementById('noLink').focus();return;}
  if(!linkValid(link)){toast('⚠️ 링크 형식이 올바르지 않아요 — 입력 방법을 확인해 주세요');document.getElementById('noLink').focus();openLinkGuide();return;}
  const kwWrap=document.getElementById('noKeywordWrap');
  const kwOn=kwWrap&&kwWrap.style.display==='block';
  const kw=kwOn?document.getElementById('noKeyword').value.trim():'';
  if(kwOn&&!kw){toast('검색 키워드를 입력해 주세요');document.getElementById('noKeyword').focus();return;}
  const q=noClamp();
  const opt=document.getElementById('noService').selectedOptions[0];
  const onm=opt?opt.textContent.split(' — ')[0]:'상품';
  var drip=null,_dc=document.getElementById('noDrip'),_dr=document.getElementById('noDripRow');
  if(_dc&&_dc.checked&&_dr&&_dr.style.display!=='none')drip={runs:Math.max(2,+document.getElementById('noDripRuns').value||10),interval:+document.getElementById('noDripInterval').value||30};
  toast(`✅ 주문 완료 — ${onm} ${odData.unit} ${q.toLocaleString('ko-KR')} · ${won(odData.price*q/1000)}`);
  if(typeof logLine==='function')logLine('ok','빠른주문 접수: '+onm+' / '+odData.unit+' '+q.toLocaleString('ko-KR')+' / '+won(odData.price*q/1000)+(drip?' / 분할 '+drip.runs+'회':'')+' / 링크 '+link.slice(0,40));
  if(typeof addOrder==='function')addOrder({id:'ORD'+Date.now(),name:onm,unit:odData.unit,qty:q,total:odData.price*q/1000,link:link,kw:kw,status:'대기',drip:drip,date:new Date().toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})});
  document.getElementById('noLink').value='';
  if(typeof showView==='function')showView('wallet');
  setTimeout(function(){var ob=document.querySelector('.wtab-btn[data-wtab="orders"]');if(ob)ob.click();},120);
}
/* ===== 📑 대량 주문 (Mass Order) ===== */
function copyNodId(id){if(navigator.clipboard)navigator.clipboard.writeText(id).then(function(){toast('상품 ID 복사: '+id);},function(){});}
function parseMass(){
  const raw=document.getElementById('massInput').value.split('\n').map(s=>s.trim()).filter(Boolean);
  return raw.map(function(ln,i){
    const parts=ln.split(/[│|]/).map(function(s){return s.trim();});
    if(parts.length<3)return {ln:i+1,err:'형식 오류 (상품ID│링크│수량)'};
    const id=parts[0],link=parts[1],qtyRaw=parts[2];
    const c=CAT.find(function(x){return x.id===id;});
    if(!c)return {ln:i+1,err:'상품ID 없음: '+id};
    if(c.broken)return {ln:i+1,err:'품절 상품: '+id};
    let qty=Math.round(+qtyRaw||0);
    if(!qty)return {ln:i+1,err:'수량 오류: '+qtyRaw};
    qty=Math.max(+c.min,Math.min(+c.max,qty));
    const host=LINK_HOST[c.plat];
    const urlOk=host?host.test(link):/^https?:\/\//i.test(link);
    const idOk=ID_KINDS.includes(c.group)&&!/\s/.test(link)&&ID_RX.test(link);
    if(!urlOk&&!idOk)return {ln:i+1,err:'링크 형식 오류: '+link.slice(0,24)};
    return {ln:i+1,c:c,id:id,link:link,qty:qty,unit:unitOf(c),name:c.ko,total:priceOf(c)*qty/1000};
  });
}
function massRender(rows){
  const ok=rows.filter(function(r){return !r.err;}),bad=rows.filter(function(r){return r.err;});
  const sum=ok.reduce(function(a,r){return a+r.total;},0);
  let h='';
  if(ok.length)h+='<div class="mass-sum ok">✅ 주문 가능 '+ok.length+'건 · 합계 '+won(sum)+'</div>'+ok.map(function(r){return '<div class="mass-line ok">'+r.ln+'. '+esc(r.name)+' × '+r.qty.toLocaleString('ko-KR')+r.unit+' = '+won(r.total)+'</div>';}).join('');
  if(bad.length)h+='<div class="mass-sum bad">⚠️ 오류 '+bad.length+'건 (주문 제외)</div>'+bad.map(function(r){return '<div class="mass-line bad">'+r.ln+'행: '+esc(r.err)+'</div>';}).join('');
  if(!rows.length)h='<div class="mass-line bad">입력이 비어 있어요.</div>';
  document.getElementById('massResult').innerHTML=h;
  return {ok:ok,bad:bad,sum:sum};
}
function massPreview(){massRender(parseMass());}
function submitMassOrder(){
  const rows=parseMass();const r=massRender(rows);
  if(!r.ok.length){toast('주문 가능한 항목이 없어요');return;}
  r.ok.forEach(function(o){if(typeof addOrder==='function')addOrder({id:'ORD'+Date.now()+Math.floor(Math.random()*9999),name:o.name,unit:o.unit,qty:o.qty,total:o.total,link:o.link,kw:'',status:'대기',date:new Date().toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})});});
  if(typeof logLine==='function')logLine('ok','대량주문 접수: '+r.ok.length+'건 · '+won(r.sum));
  toast('✅ 대량 주문 '+r.ok.length+'건 완료'+(r.bad.length?' (오류 '+r.bad.length+'건 제외)':''));
  document.getElementById('massInput').value='';document.getElementById('massResult').innerHTML='';
  if(typeof showView==='function')showView('wallet');
  setTimeout(function(){var ob=document.querySelector('.wtab-btn[data-wtab="orders"]');if(ob)ob.click();},120);
}

/* ===== 충전 / 지갑 ===== */
let chargeAmt=50000,chargePm='가상계좌';
function bonusRate(a){ // 충전 금액별 보너스율
  if(a>=500000)return .10; if(a>=300000)return .08; if(a>=100000)return .05; if(a>=50000)return .02; return 0;
}
function calcCharge(){
  const b=Math.round(chargeAmt*bonusRate(chargeAmt));
  document.getElementById('wSumAmt').textContent=won(chargeAmt);
  document.getElementById('wSumBonus').textContent=(b>0?'+':'')+won(b);
  document.getElementById('wSumTotal').textContent=won(chargeAmt+b);
}
document.querySelectorAll('#amtGrid .amt').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#amtGrid .amt').forEach(x=>x.classList.toggle('sel',x===b));
  chargeAmt=+b.dataset.amt;document.getElementById('amtCustom').value='';calcCharge();
}));
document.getElementById('amtCustom').addEventListener('input',e=>{
  const v=Math.max(0,Math.round(+e.target.value||0));
  if(v>0){document.querySelectorAll('#amtGrid .amt').forEach(x=>x.classList.remove('sel'));chargeAmt=v;calcCharge();}
});
document.querySelectorAll('#pmGrid .pm').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('#pmGrid .pm').forEach(x=>x.classList.toggle('sel',x===b));
  chargePm=b.dataset.pm;
}));
function submitCharge(){
  if(chargeAmt<1000){toast('최소 충전 금액은 ₩1,000입니다');return;}
  const b=Math.round(chargeAmt*bonusRate(chargeAmt));
  if(chargePm==='가상계좌'){
    toast(`가상계좌 발급(시안): ${won(chargeAmt)} 입금하면 ${won(chargeAmt+b)} 적립`);
  }else{
    toast(`${chargePm} 결제(시안): ${won(chargeAmt)} 충전 → ${won(chargeAmt+b)} 적립`);
  }
}
calcCharge();

/* ===== 마이페이지 탭 + 주문 내역 ===== */
document.querySelectorAll('.wtab-btn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.wtab-btn').forEach(x=>x.classList.toggle('active',x===b));
  document.querySelectorAll('.wtab-panel').forEach(p=>p.classList.toggle('active',p.id==='wtab-'+b.dataset.wtab));
  if(b.dataset.wtab==='support'&&typeof renderTickets==='function')renderTickets();
  if(b.dataset.wtab==='orders'&&typeof renderOrders==='function')renderOrders();
  if(b.dataset.wtab==='refer'&&typeof renderRefer==='function')renderRefer();
}));
document.querySelectorAll('.ofilter').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.ofilter').forEach(x=>x.classList.toggle('active',x===b));
  if(typeof renderOrders==='function')renderOrders(b.dataset.ofilter);
}));
function reorder(name){
  // 같은 상품 카드를 찾아 주문 모달 열기(없으면 토스트)
  const card=[...document.querySelectorAll('.card')].find(c=>c.dataset.name===name);
  if(card){showView('store');openOrder(card.querySelector('.order'));}
  else toast('재주문(시안): '+name);
}

/* 테마: 프리앰블(FlowDesk body.theme-dark)에서 처리 */

/* ===== PWA: 서비스워커 등록 + 이쁜 설치 배너 ===== */
if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{});});}
let deferredPrompt=null;
const pwaBanner=document.getElementById('pwaBanner');
function pwaShow(){ if(!pwaBanner)return; try{if(localStorage.getItem('pwa_dismiss')==='1')return;}catch(e){}
  if(window.matchMedia('(display-mode: standalone)').matches)return; // 이미 설치됨
  setTimeout(()=>pwaBanner.classList.add('show'),1800);
}
window.addEventListener('beforeinstallprompt',(e)=>{e.preventDefault();deferredPrompt=e;pwaShow();});
function pwaInstall(){
  if(deferredPrompt){
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(()=>{deferredPrompt=null;pwaBanner.classList.remove('show');});
  }else{
    // iOS 사파리 등 beforeinstallprompt 미지원
    toast('사파리: 공유 버튼 → "홈 화면에 추가"를 눌러 설치하세요');
  }
}
function pwaDismiss(){pwaBanner.classList.remove('show');try{localStorage.setItem('pwa_dismiss','1');}catch(e){}}
// iOS는 beforeinstallprompt가 없으니, 사파리+미설치면 안내 배너만 띄움
(function(){const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
  const standalone=window.navigator.standalone||window.matchMedia('(display-mode: standalone)').matches;
  if(ios&&!standalone)pwaShow();
})();

/* 떡상 성장 카드 — 숫자 0→목표 카운트업(라인 드로우 애니와 맞춤) */
(function(){
  const el=document.getElementById('growthNum');if(!el)return;
  const target=86420,dur=1700,t0=performance.now();
  function step(now){
    const p=Math.min(1,(now-t0)/dur);
    const v=Math.round(target*(1-Math.pow(1-p,3)));
    el.textContent=v.toLocaleString('ko-KR');
    if(p<1)requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
})();

/* 떡상 라이브 티커 + 후기 루프 + 스크롤 등장 + 통계 카운트업 */
(function(){
  const tk=[["📸","@minje_official","인스타 팔로워 1,000","3초 전"],["🎵","@dani_vlog","틱톡 조회수 10,000","11초 전"],["▶️","@sodam_tv","유튜브 구독자 300","24초 전"],["📸","@cafe.onul","인스타 좋아요 500","38초 전"],["✈️","@signal_kr","텔레그램 멤버 1,000","52초 전"],["🎧","@indie.sound","스포티파이 재생 5,000","1분 전"],["📸","@beauty_log","인스타 팔로워 2,000","1분 전"],["🎵","@daily_eat","틱톡 좋아요 3,000","2분 전"]];
  const row=document.getElementById('tickerRow');
  if(row){
    const mk=()=>tk.map(t=>`<span class="ticker-item"><span class="tdot"></span>${t[0]} <b>${t[1]}</b> ${t[2]} 떡상 완료 ✅ <span class="ago">${t[3]}</span></span>`).join('');
    row.innerHTML=mk()+mk();
  }
  const rev=document.getElementById('revRow');
  if(rev) rev.innerHTML+=rev.innerHTML; /* ×2 복제 = 끊김없는 마퀴 */

  function countUp(el){
    const target=+el.dataset.count,dur=1600,t0=performance.now();
    (function step(now){
      const p=Math.min(1,(now-t0)/dur);
      el.textContent=Math.round(target*(1-Math.pow(1-p,3))).toLocaleString('ko-KR');
      if(p<1)requestAnimationFrame(step);
    })(performance.now());
  }
  const reveals=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver((ents)=>{
      ents.forEach(e=>{
        if(!e.isIntersecting)return;
        e.target.classList.add('in');
        e.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(e.target);
      });
    },{threshold:.18});
    reveals.forEach(el=>io.observe(el));
  }else{
    reveals.forEach(el=>{el.classList.add('in');el.querySelectorAll('[data-count]').forEach(countUp);});
  }
})();

/* 작게 모아보기 토글 — 행 리스트를 압축(설명·뱃지 접고 제목+가격만), 한눈에 많이 */
function updateDenseBtn(){var on=document.body.classList.contains('dense-list');['denseBtn','denseBtn2'].forEach(function(id){var b=document.getElementById(id);if(b)b.textContent=on?'▦ 크게 보기':'☰ 작게 보기';});}
function toggleDense(){var d=document.body.classList.toggle('dense-list');try{localStorage.setItem('supply_dense',d?'1':'0')}catch(e){}updateDenseBtn();if(typeof renderShowcase==='function'&&document.getElementById('store').classList.contains('active'))renderShowcase();if(typeof renderCards==='function'&&document.getElementById('catpage').classList.contains('active'))renderCards();}
try{var _ds=localStorage.getItem('supply_dense');if(_ds==='1'||(_ds===null&&window.innerWidth<=650))document.body.classList.add('dense-list');}catch(e){}
updateDenseBtn();
updateDenseBtn();

/* ===== Supabase (ON Social Panel) — 주문·로그 기기 통합·영구 저장 ===== */
var _supa=(window.supabase&&window.supabase.createClient)?window.supabase.createClient('https://tvnhbdjozhqzzmiepjka.supabase.co','sb_publishable_9UOOHF3RGNIgkXjsU4k4bQ_9-M5RhF4'):null;
window._supa=_supa;
/* ===== 하단 활동 로그 콘솔 (회원·관리자 공통. localStorage 캐시 + Supabase 동기화) ===== */
function nowTime(){var d=new Date();var z=function(n){return('0'+n).slice(-2)};return z(d.getHours())+':'+z(d.getMinutes())+':'+z(d.getSeconds());}
function loadLogs(){try{return JSON.parse(localStorage.getItem('supply_logs')||'[]');}catch(e){return[];}}
function saveLogs(a){try{localStorage.setItem('supply_logs',JSON.stringify(a.slice(-400)));}catch(e){}}
var LOGS=loadLogs();
function renderLogs(){var box=document.getElementById('logLines');if(box){box.innerHTML=LOGS.slice(-250).map(function(l){return '<div class="logline '+(l.type||'info')+'"><span class="lt">'+l.t+'</span> '+esc(l.msg)+'</div>';}).join('');box.scrollTop=box.scrollHeight;}var n=document.getElementById('logN');if(n)n.textContent=LOGS.length;}
function logLine(type,msg){LOGS.push({t:nowTime(),type:type||'info',msg:msg});saveLogs(LOGS);renderLogs();try{if(window._supa)window._supa.from('activity_logs').insert({type:type||'info',msg:msg}).then(function(){},function(){});}catch(e){}}
function toggleLog(){var c=document.getElementById('logConsole');if(c)c.classList.toggle('open');}
function copyLog(){var txt=LOGS.map(function(l){return '['+l.t+'] '+l.msg;}).join('\n');if(navigator.clipboard)navigator.clipboard.writeText(txt).then(function(){toast('활동 로그를 복사했습니다');},function(){toast('복사 실패');});}
renderLogs();
logLine('sys','접속 — '+new Date().toLocaleString('ko-KR'));

/* ===== 주문 내역 (localStorage, 영구 DB는 나중 Supabase) ===== */
var ORDERS=(function(){try{return JSON.parse(localStorage.getItem('supply_orders')||'[]');}catch(e){return[];}})();
function saveOrders(){try{localStorage.setItem('supply_orders',JSON.stringify(ORDERS.slice(-200)));}catch(e){}}
var curOrderFilter='all';
var STAT_CLS={'대기':'wait','진행중':'run','완료':'done','부분완료':'partial','취소':'cancel'};
function orderProgress(o){
  var st=o.status||'대기', qty=+o.qty||0, rem=(o.remains!=null)?+o.remains:null;
  if(st==='완료')return 100; if(st==='취소'||st==='대기')return 0;
  if(rem!=null&&qty)return Math.max(2,Math.min(100,Math.round((qty-rem)/qty*100)));
  return st==='진행중'?12:(st==='부분완료'?50:0);
}
function renderOrders(filter){
  if(filter)curOrderFilter=filter;
  var box=document.getElementById('olist'); if(!box)return;
  var list=ORDERS.slice().reverse();
  if(curOrderFilter==='done')list=list.filter(function(o){return o.status==='완료';});
  else if(curOrderFilter==='running')list=list.filter(function(o){return o.status!=='완료'&&o.status!=='취소';});
  if(!list.length){box.innerHTML='<div class="empty">아직 주문 내역이 없어요.<br>상품을 주문하면 여기에 쌓입니다.</div>';return;}
  box.innerHTML=list.map(function(o){
    var st=o.status||'대기', cls=STAT_CLS[st]||'wait', pct=orderProgress(o);
    var qty=+o.qty||0, rem=(o.remains!=null)?+o.remains:null, done=(rem!=null)?qty-rem:null, unit=o.unit||'개';
    var acts='';
    var nm=esc(o.name||'').replace(/'/g,"\\'");
    if(st==='대기'||st==='진행중')acts='<button type="button" onclick="cancelOrder(\''+o.id+'\')">주문 취소</button><button type="button" onclick="inquireOrder(\''+o.id+'\')">문의</button>';
    else if(st==='완료')acts='<button type="button" onclick="reorder(\''+nm+'\')">재주문</button><button type="button" onclick="requestRefill(\''+o.id+'\')">🔄 리필 요청</button>';
    else if(st==='부분완료')acts='<button type="button" onclick="reorder(\''+nm+'\')">재주문</button><button type="button" onclick="inquireOrder(\''+o.id+'\')">문의</button>';
    else if(st==='취소')acts='<button type="button" onclick="reorder(\''+nm+'\')">재주문</button>';
    var info=(done!=null)?('처리 '+done.toLocaleString('ko-KR')+' / '+qty.toLocaleString('ko-KR')+unit+(rem?' · 남은 '+rem.toLocaleString('ko-KR'):'')):(unit+' '+qty.toLocaleString('ko-KR'));
    if(o.drip)info+=' · 📨'+o.drip.runs+'회 분할';
    if(o.sub)info+=' · 🔁'+(o.sub.days||'')+'일 구독';
    return '<div class="oitem"><div class="oitem-ic">◎</div><div class="oitem-main">'
      +'<div class="oitem-top"><b>'+esc(o.name||'')+'</b><span class="ost '+cls+'">'+esc(st)+'</span></div>'
      +'<div class="oitem-link">🔗 '+esc((o.link||'').slice(0,44))+'</div>'
      +'<div class="oprog"><i class="oprog-bar '+cls+'" style="width:'+pct+'%"></i></div>'
      +'<div class="oitem-meta">'+info+' · 주문 '+esc(o.id)+(o.kw?' · 🔑'+esc(o.kw):'')+'</div>'
      +(acts?'<div class="oitem-acts">'+acts+'</div>':'')
      +'</div><div class="oitem-side"><div class="oitem-amt">'+won(o.total||0)+'</div><div class="oitem-date">'+esc(o.date||'')+'</div></div></div>';
  }).join('');
}
function requestRefill(id){var o=ORDERS.filter(function(x){return x.id===id;})[0];if(!o)return;if(typeof logLine==='function')logLine('info','리필 요청: '+o.name+' / '+id);toast('🔄 리필 요청이 접수되었습니다');}
function addOrder(o){ORDERS.push(o);saveOrders();renderOrders();try{if(window._supa)window._supa.from('orders').insert({id:o.id,name:o.name,unit:o.unit,qty:o.qty,total:o.total,link:o.link,kw:o.kw,status:o.status}).then(function(r){if(r&&r.error)logLine('warn','내역 저장 경고: '+r.error.message);},function(){});}catch(e){}}
function cancelOrder(id){var o=ORDERS.filter(function(x){return x.id===id;})[0];if(!o)return;if(!confirm('이 주문을 취소할까요? (환불 처리됩니다)'))return;o.status='취소';saveOrders();renderOrders();try{if(window._supa)window._supa.from('orders').update({status:'취소'}).eq('id',id).then(function(){},function(){});}catch(e){}if(typeof logLine==='function')logLine('warn','주문 취소: '+o.name+' / '+o.id);toast('주문을 취소했습니다');}
function inquireOrder(id){showView('wallet');var b=document.querySelector('.wtab-btn[data-wtab="support"]');if(b)b.click();var o=document.getElementById('tkOrder');if(o)o.value=id||'';var s=document.getElementById('tkSubject');if(s)setTimeout(function(){s.focus();},150);toast('문의 내용을 작성해 주세요');}

/* ===== 🎫 고객지원 티켓 (localStorage + Supabase 준비) ===== */
var TICKETS=(function(){try{return JSON.parse(localStorage.getItem('supply_tickets')||'[]');}catch(e){return[];}})();
function saveTickets(){try{localStorage.setItem('supply_tickets',JSON.stringify(TICKETS.slice(-100)));}catch(e){}}
var TK_CLS={'열림':'wait','답변완료':'done','종료':'cancel'};
function tkNow(){return new Date().toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});}
function submitTicket(){
  var cat=document.getElementById('tkCat').value, ord=document.getElementById('tkOrder').value.trim();
  var sub=document.getElementById('tkSubject').value.trim(), body=document.getElementById('tkBody').value.trim();
  if(!sub){toast('제목을 입력해 주세요');document.getElementById('tkSubject').focus();return;}
  if(!body){toast('내용을 입력해 주세요');document.getElementById('tkBody').focus();return;}
  var t={id:'TK'+Date.now(),cat:cat,orderId:ord,subject:sub,status:'열림',msgs:[{who:'나',text:body,time:tkNow()}],created:tkNow()};
  TICKETS.push(t);saveTickets();
  try{if(window._supa)window._supa.from('tickets').insert({id:t.id,cat:cat,order_id:ord,subject:sub,status:'열림',msgs:t.msgs}).then(function(){},function(){});}catch(e){}
  if(typeof logLine==='function')logLine('ok','문의 접수: '+sub);
  document.getElementById('tkSubject').value='';document.getElementById('tkBody').value='';document.getElementById('tkOrder').value='';
  renderTickets();toast('🎫 문의가 접수됐어요. 답변은 문의 내역에서 확인하세요.');
}
function renderTickets(){
  var box=document.getElementById('tkList');if(!box)return;
  var cnt=document.getElementById('tkCount');if(cnt)cnt.textContent=TICKETS.length+'건';
  if(!TICKETS.length){box.innerHTML='<div class="empty">아직 문의 내역이 없어요.</div>';return;}
  box.innerHTML=TICKETS.slice().reverse().map(function(t){
    var cls=TK_CLS[t.status]||'wait',last=t.msgs[t.msgs.length-1];
    return '<div class="tk-item" onclick="openTicket(\''+t.id+'\',false)">'
      +'<div class="tk-item-top"><b>'+esc(t.subject)+'</b><span class="ost '+cls+'">'+esc(t.status)+'</span></div>'
      +'<div class="tk-item-sub">'+esc(t.cat)+(t.orderId?' · '+esc(t.orderId):'')+' · '+esc(t.created)+'</div>'
      +'<div class="tk-item-last">'+(last.who==='상담원'?'💬 상담원: ':'')+esc(last.text.slice(0,50))+'</div></div>';
  }).join('');
}
var curTicket=null,curAdminMode=false;
function openTicket(id,adminMode){
  var t=TICKETS.filter(function(x){return x.id===id;})[0];if(!t)return;
  curTicket=id;curAdminMode=!!adminMode;
  document.getElementById('tkmSubject').textContent=t.subject;
  var stEl=document.getElementById('tkmStatus');stEl.textContent=t.status;stEl.className='ost '+(TK_CLS[t.status]||'wait');
  document.getElementById('tkmInfo').innerHTML=esc(t.cat)+(t.orderId?' · 주문 '+esc(t.orderId):'')+' · '+esc(t.created);
  document.getElementById('tkmThread').innerHTML=t.msgs.map(function(m){
    return '<div class="tk-bubble '+(m.who==='상담원'?'agent':'user')+'"><div class="tk-bw">'+esc(m.text)+'</div><div class="tk-bt">'+esc(m.who)+' · '+esc(m.time)+'</div></div>';
  }).join('');
  var acts=document.getElementById('tkmActs'),msgEl=document.getElementById('tkmMsg');
  if(t.status==='종료'){msgEl.style.display='none';acts.innerHTML='<div class="tk-closed">종료된 문의입니다.</div>';}
  else{msgEl.style.display='';msgEl.value='';
    if(adminMode)acts.innerHTML='<button class="oorder-go" onclick="sendTicket(true)">답변 보내기</button><button class="secondary tk-close-btn" onclick="closeTicketStatus()">종료</button>';
    else acts.innerHTML='<button class="oorder-go" onclick="sendTicket(false)">메시지 보내기</button>';}
  document.getElementById('ticketModal').classList.add('show');
  setTimeout(function(){var th=document.getElementById('tkmThread');th.scrollTop=th.scrollHeight;},50);
}
function closeTicket(){document.getElementById('ticketModal').classList.remove('show');}
function sendTicket(adminMode){
  var t=TICKETS.filter(function(x){return x.id===curTicket;})[0];if(!t)return;
  var msg=document.getElementById('tkmMsg').value.trim();if(!msg){toast('메시지를 입력해 주세요');return;}
  t.msgs.push({who:adminMode?'상담원':'나',text:msg,time:tkNow()});
  t.status=adminMode?'답변완료':'열림';saveTickets();
  try{if(window._supa)window._supa.from('tickets').update({msgs:t.msgs,status:t.status}).eq('id',t.id).then(function(){},function(){});}catch(e){}
  openTicket(curTicket,adminMode);renderTickets();if(typeof renderAdminTickets==='function')renderAdminTickets();
  toast(adminMode?'답변을 보냈습니다':'메시지를 보냈습니다');
}
function closeTicketStatus(){
  var t=TICKETS.filter(function(x){return x.id===curTicket;})[0];if(!t)return;
  t.status='종료';saveTickets();
  try{if(window._supa)window._supa.from('tickets').update({status:'종료'}).eq('id',t.id).then(function(){},function(){});}catch(e){}
  openTicket(curTicket,curAdminMode);renderTickets();if(typeof renderAdminTickets==='function')renderAdminTickets();toast('문의를 종료했습니다');
}
function renderAdminTickets(){
  var box=document.getElementById('atkList');if(!box)return;
  var f=document.getElementById('atkFilter')?document.getElementById('atkFilter').value:'all';
  var st=document.getElementById('atkStats');
  var op=TICKETS.filter(function(t){return t.status==='열림';}).length;
  var rp=TICKETS.filter(function(t){return t.status==='답변완료';}).length;
  var cl=TICKETS.filter(function(t){return t.status==='종료';}).length;
  if(st)st.innerHTML='<div class="atk-s wait"><b>'+op+'</b>열림</div><div class="atk-s done"><b>'+rp+'</b>답변완료</div><div class="atk-s cancel"><b>'+cl+'</b>종료</div>';
  var list=TICKETS.slice().reverse();if(f!=='all')list=list.filter(function(t){return t.status===f;});
  if(!list.length){box.innerHTML='<div class="empty">문의가 없습니다.</div>';return;}
  box.innerHTML=list.map(function(t){
    var cls=TK_CLS[t.status]||'wait',last=t.msgs[t.msgs.length-1];
    return '<div class="tk-item" onclick="openTicket(\''+t.id+'\',true)">'
      +'<div class="tk-item-top"><b>'+esc(t.subject)+'</b><span class="ost '+cls+'">'+esc(t.status)+'</span></div>'
      +'<div class="tk-item-sub">'+esc(t.cat)+(t.orderId?' · '+esc(t.orderId):'')+' · '+esc(t.created)+'</div>'
      +'<div class="tk-item-last">'+esc(last.who)+': '+esc(last.text.slice(0,60))+'</div></div>';
  }).join('');
}
function adminTab(name){
  document.querySelectorAll('.atab-btn').forEach(function(b){b.classList.toggle('active',b.dataset.atab===name);});
  document.querySelectorAll('.atab-panel').forEach(function(p){p.classList.toggle('active',p.id==='atab-'+name);});
  if(name==='support')renderAdminTickets();
  if(name==='refer')renderAdminRefer();
  if(name==='notice')renderAdminNotices();
}
/* 관리자 섹션 접기/펴기 (admin-sub 헤더 클릭) */
function admToggle(h,e){
  if(e&&e.target&&e.target.closest('button,select,input'))return; // 내부 액션은 토글 제외
  var col=h.classList.toggle('adm-collapsed');
  var el=h.nextElementSibling;
  while(el&&!(el.classList&&el.classList.contains('admin-sub'))){el.style.display=col?'none':'';el=el.nextElementSibling;}
}
function bindAdmAccordion(){
  document.querySelectorAll('#admin .admin-sub').forEach(function(h){
    if(h._accBound)return; h._accBound=true;
    h.style.cursor='pointer';
    h.addEventListener('click',function(e){admToggle(h,e);});
  });
}
document.getElementById('ticketModal').addEventListener('click',function(e){if(e.target.id==='ticketModal')closeTicket();});

/* ===== 🤝 추천 프로그램 (Affiliates) — 실제 적립은 회원 연동 후 ===== */
var REF_RATE=0.05;
(function(){var m=location.search.match(/[?&]ref=([A-Z0-9]+)/i);if(m){try{localStorage.setItem('supply_referred_by',m[1].toUpperCase())}catch(e){}}})();
function myRefCode(){var c=null;try{c=localStorage.getItem('supply_refcode')}catch(e){}if(!c){c=Math.random().toString(36).slice(2,8).toUpperCase();try{localStorage.setItem('supply_refcode',c)}catch(e){}}return c;}
function getRef(){try{return JSON.parse(localStorage.getItem('supply_ref')||'{}')}catch(e){return{}}}
function saveRef(r){try{localStorage.setItem('supply_ref',JSON.stringify(r))}catch(e){}}
function renderRefer(){
  var code=myRefCode();
  var cEl=document.getElementById('refCode');if(cEl)cEl.textContent=code;
  var lEl=document.getElementById('refLink');if(lEl)lEl.value=location.origin+location.pathname+'?ref='+code;
  var r=getRef(),friends=r.friends||[],earned=r.earned||0,conv=r.converted||0,avail=Math.max(0,earned-conv);
  var n=document.getElementById('refN');if(n)n.textContent=friends.length;
  var e=document.getElementById('refEarned');if(e)e.textContent=won(earned);
  var a=document.getElementById('refAvail');if(a)a.textContent=won(avail);
  var fn=document.getElementById('refFriendN');if(fn)fn.textContent=friends.length+'명';
  var fl=document.getElementById('refFriends');
  if(fl){if(!friends.length)fl.innerHTML='<div class="empty">아직 추천한 친구가 없어요.<br>링크를 공유해 보세요!</div>';
    else fl.innerHTML=friends.map(function(f){return '<div class="ref-friend"><b>'+esc(f.name||'친구')+'</b><span>'+esc(f.date||'')+'</span><em>+'+won(f.earned||0)+'</em></div>';}).join('');}
}
function copyRef(){var c=myRefCode();if(navigator.clipboard)navigator.clipboard.writeText(c).then(function(){toast('추천 코드 복사: '+c)},function(){});}
function copyRefLink(){var l=document.getElementById('refLink').value;if(navigator.clipboard)navigator.clipboard.writeText(l).then(function(){toast('추천 링크를 복사했어요 — 친구에게 공유하세요!')},function(){});}
function convertRefEarn(){var r=getRef();var avail=(r.earned||0)-(r.converted||0);if(avail<=0){toast('전환할 적립금이 없어요');return;}r.converted=(r.converted||0)+avail;saveRef(r);renderRefer();if(typeof logLine==='function')logLine('ok','적립금 전환: '+won(avail));toast('✅ '+won(avail)+'을 잔액으로 전환했어요');}
function renderAdminRefer(){
  var box=document.getElementById('arefList');if(!box)return;
  var r=getRef(),friends=r.friends||[],earned=r.earned||0;
  var st=document.getElementById('arefStats');
  if(st)st.innerHTML='<div class="atk-s"><b>'+friends.length+'</b>추천 가입</div><div class="atk-s done"><b>'+won(earned)+'</b>총 적립</div><div class="atk-s"><b>'+won(r.converted||0)+'</b>전환 완료</div>';
  if(!friends.length){box.innerHTML='<div class="empty">아직 추천 가입이 없습니다.<br>고객이 추천 링크로 친구를 데려오면 여기에 쌓입니다.</div>';return;}
  box.innerHTML=friends.map(function(f){return '<div class="tk-item"><div class="tk-item-top"><b>'+esc(f.name||'친구')+'</b><span class="ost done">+'+won(f.earned||0)+'</span></div><div class="tk-item-sub">추천인 '+esc(f.by||'')+' · '+esc(f.date||'')+'</div></div>';}).join('');
}

/* ===== 📢 공지사항 (Updates) ===== */
var NOTICES=(function(){try{return JSON.parse(localStorage.getItem('supply_notices')||'[]')}catch(e){return[]}})();
function saveNotices(){try{localStorage.setItem('supply_notices',JSON.stringify(NOTICES.slice(-50)))}catch(e){}}
function submitNotice(){
  var type=document.getElementById('ntType').value,title=document.getElementById('ntTitle').value.trim(),body=document.getElementById('ntBody').value.trim();
  if(!title){toast('제목을 입력해 주세요');document.getElementById('ntTitle').focus();return;}
  if(!body){toast('내용을 입력해 주세요');document.getElementById('ntBody').focus();return;}
  var n={id:'NT'+Date.now(),type:type,title:title,body:body,created:tkNow()};
  NOTICES.push(n);saveNotices();
  try{if(window._supa)window._supa.from('notices').insert({id:n.id,type:type,title:title,body:body}).then(function(){},function(){});}catch(e){}
  document.getElementById('ntTitle').value='';document.getElementById('ntBody').value='';
  renderAdminNotices();noticeBadge();if(typeof logLine==='function')logLine('ok','공지 발행: '+title);toast('📢 공지를 발행했어요');
}
function deleteNotice(id){if(!confirm('이 공지를 삭제할까요?'))return;NOTICES=NOTICES.filter(function(n){return n.id!==id});saveNotices();try{if(window._supa)window._supa.from('notices').delete().eq('id',id).then(function(){},function(){})}catch(e){}renderAdminNotices();noticeBadge();toast('공지를 삭제했습니다');}
function renderAdminNotices(){
  var box=document.getElementById('antList');if(!box)return;
  if(!NOTICES.length){box.innerHTML='<div class="empty">발행된 공지가 없습니다.</div>';return;}
  box.innerHTML=NOTICES.slice().reverse().map(function(n){return '<div class="tk-item"><div class="tk-item-top"><b>'+esc(n.type)+' '+esc(n.title)+'</b><button class="nt-del" onclick="deleteNotice(\''+n.id+'\')">삭제</button></div><div class="tk-item-sub">'+esc(n.created)+'</div><div class="tk-item-last">'+esc(n.body.slice(0,60))+'</div></div>';}).join('');
}
function openNotices(){
  var box=document.getElementById('noticeList');
  if(!NOTICES.length)box.innerHTML='<div class="empty">아직 공지가 없어요.</div>';
  else box.innerHTML=NOTICES.slice().reverse().map(function(n){return '<div class="notice-item"><div class="notice-it-top"><b>'+esc(n.type)+' '+esc(n.title)+'</b><span>'+esc(n.created)+'</span></div><div class="notice-it-body">'+esc(n.body)+'</div></div>';}).join('');
  document.getElementById('noticeModal').classList.add('show');
  try{localStorage.setItem('supply_notice_seen',NOTICES.length?NOTICES[NOTICES.length-1].id:'')}catch(e){}
  noticeBadge();
}
function closeNotices(){document.getElementById('noticeModal').classList.remove('show');}
function noticeBadge(){
  var dot=document.getElementById('noticeDot');if(!dot)return;
  var seen=null;try{seen=localStorage.getItem('supply_notice_seen')}catch(e){}
  var last=NOTICES.length?NOTICES[NOTICES.length-1].id:null;
  dot.hidden=!(last&&last!==seen);
}
document.getElementById('noticeModal').addEventListener('click',function(e){if(e.target.id==='noticeModal')closeNotices();});
noticeBadge();
/* 앱 시작 시 Supabase에서 주문·로그 당겨와 기기 통합(어느 기기서 봐도 동일) */
async function syncFromSupa(){
  if(!window._supa)return;
  try{
    var r1=await window._supa.from('orders').select('*').order('created_at',{ascending:true});
    if(r1&&r1.data){ORDERS=r1.data.map(function(o){return {id:o.id,name:o.name,unit:o.unit,qty:o.qty,total:o.total,link:o.link,kw:o.kw,status:o.status,date:new Date(o.created_at).toLocaleString('ko-KR',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'})};});saveOrders();renderOrders();}
    var r2=await window._supa.from('activity_logs').select('*').order('created_at',{ascending:false}).limit(250);
    if(r2&&r2.data){LOGS=r2.data.reverse().map(function(l){return {t:new Date(l.created_at).toLocaleTimeString('ko-KR',{hour12:false}),type:l.type,msg:l.msg};});saveLogs(LOGS);renderLogs();}
  }catch(e){}
}
syncFromSupa();

/* 초기 라우트 */
if(typeof showView==="function")showView("store");
