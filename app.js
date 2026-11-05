/* ===== ON 서플라이 — FlowDesk 셸 연결 (네비·테마·관리자·인트로·PWA) ===== */
(function(){
  const NAV=[['store','서비스몰','🛍'],['reseller','파트너·API','⚡'],['wallet','지갑','💳']];
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
const PH={인스타그램:'https://instagram.com/내아이디',틱톡:'https://tiktok.com/@내아이디',유튜브:'https://youtube.com/watch?v=...',트위치:'https://twitch.tv/내채널',킥:'https://kick.com/내채널',텔레그램:'https://t.me/내채널',스포티파이:'https://open.spotify.com/...',페이스북:'https://facebook.com/내페이지',디스코드:'https://discord.gg/초대코드'};
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
/* 특성 뱃지(품질·안정·속도) + 소스(유입경로). 폴백 데이터엔 없을 수 있어 방어적. */
const SRC_ICON={외부유입:'🔗',광고:'📣',실유저:'🙋','검색/탐색':'🔎',프로필:'👤'};
function badgeHtml(c){
  const bs=Array.isArray(c.badges)?c.badges:[];
  let h=bs.map(t=>`<span class="bdg">${esc(t)}</span>`).join('');
  if(c.source)h+=`<span class="bdg src">${SRC_ICON[c.source]||'•'} ${esc(c.source)}</span>`;
  return h?`<div class="bdgs">${h}</div>`:'';
}
function clsOf(c){return CLS[c.plat]||'etc';}
function phOf(c){return PH[c.plat]||'주문할 공개 링크를 입력하세요';}

/* 공개 목록(관리자 토글) — localStorage. 없으면 기본 공개셋 자동 생성 */
function defaultLive(){
  // 기본 공개 = 깨지지 않은 전체 상품(9천여개 다 노출). 관리자가 숨기고 싶은 것만 끄면 됨.
  return new Set(CAT.filter(c=>!c.broken).map(c=>c.id));
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
const LIVE_VER='2'; // 기본 공개셋 의미 변경(전체공개) → 옛 저장분 1회 무효화
function loadLive(){ try{
  if(localStorage.getItem('supply_live_v')===LIVE_VER){const s=localStorage.getItem('supply_live'); if(s)return new Set(JSON.parse(s));}
}catch(e){} return defaultLive(); }
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
  let h=`<button class="pill${kind==='all'?' active':''}" data-kind="all">전체</button>`;
  CATS.filter(c=>!c.hidden).forEach(c=>{h+=`<button class="pill${kind===c.key?' active':''}" data-kind="${esc(c.key)}">${esc(c.label)}</button>`;});
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
    (kind==='all'||c.group===kind)&&
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
  renderSubPills(); rerenderCurrent();
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
  platform=b.dataset.platform;subf='all';setCatTitle();renderSubPills();resetAndRender();
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
/* 공급처 키 → {잔액칸 id, 로고} 매핑 */
const PROVIDERS={'Stream-Promotion':{el:'balSP',logo:'SP'},'SMB Panel':{el:'balSMB',logo:'SMB'},'RealSite':{el:'balREAL',logo:'RS'}};
let BAL={}; // 공급처별 현재 잔액(USD) — 충전 낙관적 반영용
function paintBal(name){
  const el=document.getElementById(PROVIDERS[name].el); if(!el)return;
  const v=BAL[name];
  el.innerHTML = (v!=null&&isFinite(v)) ? `$${Number(v).toFixed(2)} <small>USD</small>` : '<span style="color:var(--pop)">백엔드 미연결</span>';
  const card=el.closest('.provider'); if(card)card.classList.toggle('low', v!=null&&v<10); // 10달러 미만 경고
}
async function loadBalances(){
  Object.keys(PROVIDERS).forEach(n=>{const el=document.getElementById(PROVIDERS[n].el);if(el)el.innerHTML='불러오는 중…';});
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
  if(bc)bc.textContent={store:'서비스몰',reseller:'파트너·API',wallet:'지갑',admin:'관리자'}[navId]||'서비스몰';
  if(id==='store'&&typeof renderShowcase==='function')renderShowcase();
  if(id==='admin'&&typeof adminRender==='function'){try{fillAdminSelects();adminRender();}catch(e){console.warn('[관리자] 렌더 오류',e.message);}}
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
/* 종류(group)별 상품 안내 — 인스타몬스터식 서비스개요·주의 */
const ORDER_GUIDE={
  팔로워:['실제 유저 기반으로 팔로워를 늘려 계정 신뢰도·노출을 높입니다.','작업 중 계정을 비공개로 바꾸지 마세요.'],
  구독자:['채널 구독자를 늘려 노출과 신뢰도를 높입니다.','공개 채널이어야 합니다.'],
  좋아요:['게시물 좋아요를 늘려 참여율·추천 노출을 높입니다.','비공개·삭제 시 작업이 불가합니다.'],
  댓글:['실제 반응형 댓글로 게시물 신뢰도를 높입니다.','댓글은 주제 기반으로 자연스럽게 작성됩니다.'],
  조회수:['영상 조회수를 늘려 추천·인기 노출에 유리하게 합니다.','공개 영상 링크여야 합니다.'],
  재생:['음원 재생수를 늘려 차트·추천에 유리하게 합니다.'],
  시청자:['라이브 방송에 실시간 시청자를 유입합니다.','방송이 켜져 있을 때만 작동합니다.'],
  멤버:['그룹·채널 멤버를 늘려 활성도를 높입니다.','공개 초대 링크가 필요합니다.'],
  공유:['게시물 공유로 확산·노출을 높입니다.'],
  트래픽:['검색·외부 경로로 실제 페이지 방문을 유입합니다.','검색 유입은 아래 키워드가 중요합니다.'],
  기타:['상품 설명을 확인하고 주문해 주세요.'],
};
const ORDER_COMMON='잔액·링크 공개 상태를 확인하세요 / 같은 게시물에 이전 작업이 끝나기 전 중복주문은 피하세요.';
function openOrder(btn){
  const c=btn.closest('.card')||btn.closest('.prow')||btn;const d=c.dataset;
  closeDetail();
  odData={price:+d.price,min:+d.min,max:+d.max,unit:d.unit};
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
  // 상품 안내(종류별 서비스개요·주의)
  const guide=ORDER_GUIDE[d.kind]||ORDER_GUIDE.기타;
  const og=document.getElementById('odGuide');
  if(og)og.innerHTML='<div class="og-t">📋 이 상품 안내</div>'+guide.map(t=>`<div class="og-li">· ${esc(t)}</div>`).join('')+`<div class="og-sub">⚠️ ${esc(ORDER_COMMON)}</div>`;
  // 링크 — 종류(group)별 맞춤 라벨/안내
  const spec=ORDER_INPUT[d.kind]||ORDER_INPUT.기타;
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
  var kwWrap=document.getElementById('odKeywordWrap');
  if(kwWrap&&kwWrap.style.display==='block'&&!document.getElementById('odKeyword').value.trim()){toast('검색 키워드를 입력해 주세요');document.getElementById('odKeyword').focus();return;}
  const q=clampQty(+document.getElementById('odQtyNum').value);
  closeOrder();
  toast(`주문 접수(시안): ${odData.unit} ${q.toLocaleString('ko-KR')} · ${won(odData.price*q/1000)}`);
}
document.getElementById('orderModal').addEventListener('click',e=>{if(e.target.id==='orderModal')closeOrder();});
document.getElementById('detailModal').addEventListener('click',e=>{if(e.target.id==='detailModal')closeDetail();});

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
}));
document.querySelectorAll('.ofilter').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.ofilter').forEach(x=>x.classList.toggle('active',x===b));
  const f=b.dataset.ofilter;
  document.querySelectorAll('#olist .oitem').forEach(it=>{
    it.style.display=(f==='all'||it.dataset.ostatus===f)?'':'none';
  });
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
function updateDenseBtn(){var b=document.getElementById('denseBtn');if(b)b.textContent=document.body.classList.contains('dense-list')?'▦ 크게 보기':'☰ 작게 보기';}
function toggleDense(){var d=document.body.classList.toggle('dense-list');try{localStorage.setItem('supply_dense',d?'1':'0')}catch(e){}updateDenseBtn();}
try{if(localStorage.getItem('supply_dense')==='1')document.body.classList.add('dense-list');}catch(e){}
updateDenseBtn();

/* 초기 라우트 */
if(typeof showView==="function")showView("store");
