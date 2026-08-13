/* ==========================================================
   store.js — 進度儲存 + Leitner 間隔重複排程
   localStorage 不可用時（例如沙箱預覽）自動退回記憶體，不會壞掉
   ========================================================== */

const Store = (function(){
  const KEY = "huapian.v3";
  let ok = true, mem = null;
  try { localStorage.setItem("__t","1"); localStorage.removeItem("__t"); }
  catch(e){ ok = false; }

  const blank = () => ({
    unlocked:1, stars:{}, stickers:[], facts:{},
    total:0, correct:0, sound:true, allOpen:false
  });

  function load(){
    let raw = null;
    if(ok){ try{ const s = localStorage.getItem(KEY); raw = s ? JSON.parse(s) : null; }catch(e){} }
    else raw = mem;
    const s = Object.assign(blank(), raw || {});
    if(!s.stars) s.stars = {};
    if(!s.facts) s.facts = {};
    if(!Array.isArray(s.stickers)) s.stickers = [];
    return s;
  }
  function persist(s){
    if(!ok){ mem = s; return; }
    try{ localStorage.setItem(KEY, JSON.stringify(s)); }
    catch(e){ ok = false; mem = s; }
  }
  return { available:ok, load, persist, blank };
})();

let S = Store.load();
const save = () => Store.persist(S);

/* ---------- 熟練度 ---------- */
const DAY = 86400000;
const INTERVAL = [0, 0, DAY, 2*DAY, 4*DAY, 7*DAY];   // 盒號 0..5
const FAST_MS = 3500;                                 // 流暢門檻

const fkey = (a,b) => Math.min(a,b) + "x" + Math.max(a,b);
function fact(a,b){
  const k = fkey(a,b);
  if(!S.facts[k]) S.facts[k] = {box:0, right:0, wrong:0, last:0, best:null};
  return S.facts[k];
}
function grade(a,b,right,ms,firstTry){
  const f = fact(a,b);
  if(right){
    f.right++;
    if(firstTry){
      const fast = ms < FAST_MS;
      f.box = Math.min(5, f.box + ((fast || f.box === 0) ? 1 : 0));
      if(f.best === null || ms < f.best) f.best = ms;
    }
  }else{
    f.wrong++;
    f.box = Math.max(0, f.box - 2);
  }
  f.last = Date.now();
}
/* 從候選組合裡挑最該練的：盒號低、到期、常錯的優先，再加一點隨機 */
function weakest(pairs){
  const now = Date.now();
  let best = null, bs = -1;
  for(const p of pairs){
    const f = fact(p[0], p[1]);
    let s = (5 - f.box) * 10;
    if(now - f.last >= (INTERVAL[f.box] || 0)) s += 25;
    if(f.wrong > f.right) s += 15;
    s += Math.random() * 22;
    if(s > bs){ bs = s; best = p; }
  }
  return best;
}

/* ---------- 音效：答對才有，答錯不出聲 ---------- */
let audioCtx = null;
function chime(){
  if(!S.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    [784, 988, 1175].forEach((f,i) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + i*0.07);
      g.gain.exponentialRampToValueAtTime(0.12, t + i*0.07 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + i*0.07 + 0.22);
      o.connect(g); g.connect(audioCtx.destination);
      o.start(t + i*0.07); o.stop(t + i*0.07 + 0.26);
    });
  }catch(e){}
}
