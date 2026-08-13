/* ==========================================================
   game.js — 遊戲流程（play.html 專用）
   ========================================================== */

const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const levelId = Math.min(LEVELS.length, Math.max(1, parseInt(params.get("lv"), 10) || 1));
const LEVEL = LEVELS.filter(l => l.id === levelId)[0];

let run = {i:0, marks:[], right:0};
let q = null, typed = "", tries = 0, startedAt = 0, locked = false;

/* ---------- 進度條 ---------- */
function drawMeter(){
  $("meter").style.width = Math.round(run.i / LEVEL.n * 100) + "%";
  $("count").textContent = run.right + "/" + LEVEL.n;
}

/* ---------- 花片托盤 ---------- */
function trayHTML(t){
  if(!t || t.hidden) return "";
  if(t.rows < 1 || t.cols < 1)
    return '<div class="tray" id="tray"><div class="pile"><div class="line" style="width:48px;height:17px"></div></div></div>';
  let h = '<div class="tray" id="tray">';
  const chip = (r,i) => '<span class="chip c' + (r % 6) + '" style="animation-delay:' +
                        Math.min(i*20, 900) + 'ms"></span>';
  if(t.split){
    for(let r=0;r<t.rows;r++){
      h += '<div class="pile"><div class="line">';
      for(let c=0;c<t.cols;c++) h += chip(r, r*t.cols + c);
      h += '</div></div>';
    }
  }else{
    h += '<div class="pile">';
    for(let r=0;r<t.rows;r++){
      h += '<div class="line">';
      for(let c=0;c<t.cols;c++) h += chip(r, r*t.cols + c);
      h += '</div>';
    }
    h += '</div>';
  }
  return h + '</div>';
}

/* ---------- 畫面 ---------- */
function render(){
  let h = "";
  if(q.ask) h += '<div class="bubble">' + q.ask + '</div>';
  h += trayHTML(q.tray);

  const shown = typed || "?", cls = "slot" + (typed ? "" : " blank");
  if(q.kind === "number"){
    if(q.eq && q.eq.length === 3)
      h += '<div class="eq"><span class="' + cls + '">' + shown + '</span><span class="op">×</span>' +
           '<span>' + q.eq[1] + '</span><span class="op">=</span><span>' + q.eq[2] + '</span></div>';
    else if(q.eq)
      h += '<div class="eq"><span>' + q.eq[0] + '</span><span class="op">×</span><span>' + q.eq[1] +
           '</span><span class="op">=</span><span class="' + cls + '">' + shown + '</span></div>';
    else
      h += '<div class="eq"><span class="' + cls + '">' + shown + '</span></div>';
  }else if(q.kind === "turn"){
    h += '<div class="eq"><span>' + q.b + '</span><span class="op">×</span><span>' + q.a +
         '</span><span class="op">=</span><span class="' + cls + '">' + shown + '</span></div>';
  }
  h += '<div class="cap" id="cap"></div>';
  $("stage").innerHTML = h;

  if(q.kind === "choice"){
    $("input").innerHTML = '<div class="choices">' +
      q.options.map(o => '<button class="choice" data-pick="' + o + '">' +
        o.replace("×", " × ").replace("+", " ＋ ") + '</button>').join("") +
      '</div><div class="keys" style="grid-template-columns:1fr">' +
      '<button class="key hint" data-key="hint">給我提示</button></div>';
  }else{
    $("input").innerHTML = '<div class="keys">' +
      [1,2,3,4,5,6,7,8,9].map(n => '<button class="key" data-key="' + n + '">' + n + '</button>').join("") +
      '<button class="key small" data-key="clear">清除</button>' +
      '<button class="key" data-key="0">0</button>' +
      '<button class="key hint" data-key="hint">提示</button>' +
      '<button class="key ok" id="ok" data-key="ok">確定</button></div>';
    if($("ok")) $("ok").disabled = !typed;
  }
}

function nextQuestion(){
  if(run.i >= LEVEL.n) return finish();
  q = makeQuestion(LEVEL.id);
  typed = ""; tries = 0; locked = false; startedAt = Date.now();
  render(); drawMeter();
  $("say").className = "say"; $("say").textContent = "";
  setMood("idle");
}
function setMood(m){
  $("mascot").innerHTML = mascot(m);
}

/* ---------- 輸入 ---------- */
function type(v){
  if(locked || (q.kind !== "number" && q.kind !== "turn")) return;
  if(v === "clear") typed = "";
  else if(typed.length < 3) typed += v;
  const slot = document.querySelector(".slot");
  if(slot){
    slot.textContent = typed || "?";
    slot.className = "slot" + (typed ? "" : " blank");
  }
  if($("ok")) $("ok").disabled = !typed;
}
function showHint(){
  if(locked) return;
  if(q.tray && q.tray.hidden){ q.tray.hidden = false; render(); }
  $("cap").innerHTML = q.hint();
  if(q.kind === "turn"){
    const t = $("tray");
    if(t) setTimeout(() => t.classList.add("turn"), 200);
  }
  if(q.track) fact(q.a, q.b).last = Date.now();
  tries = Math.max(tries, 1);
  setMood("think");
}
const PRAISE = ["答對了！","太棒了！","好厲害！","就是這個！","你好強！"];

function submit(value){
  if(locked) return;
  const correct = String(value) === String(q.answer);
  const ms = Date.now() - startedAt;
  S.total++;
  if(correct) S.correct++;
  if(q.track) grade(q.a, q.b, correct, ms, tries === 0);
  save();

  if(correct){
    locked = true;
    if(run.marks[run.i] !== "ok" && run.marks[run.i] !== "no"){
      run.marks[run.i] = "ok"; run.right++;
    }
    const slot = document.querySelector(".slot");
    if(slot) slot.className = "slot yes";
    $("say").className = "say yes";
    $("say").innerHTML = (tries ? "這次對了！" : pickOne(PRAISE)) +
      (q.track ? '<span class="kou">' + kouJue(q.a, q.b) + '</span>' : "");
    setMood("cheer");
    $("mascot").classList.add("cheer");
    setTimeout(() => $("mascot").classList.remove("cheer"), 700);
    if(!tries) confetti();
    chime();
    drawMeter();
    setTimeout(() => { run.i++; nextQuestion(); }, tries ? 1200 : 880);
  }else{
    tries++;
    run.marks[run.i] = "no";
    typed = "";
    if(q.tray) q.tray.hidden = false;
    render();
    const slot = document.querySelector(".slot");
    if(slot) slot.classList.add("no");
    $("cap").innerHTML = q.hint();
    if(q.kind === "turn"){
      const t = $("tray");
      if(t) setTimeout(() => t.classList.add("turn"), 250);
    }
    setMood("think");
    $("mascot").classList.add("oops");
    setTimeout(() => $("mascot").classList.remove("oops"), 520);
    $("say").className = "say no";
    $("say").textContent = "看看花片就知道囉";
    setTimeout(() => {
      $("say").className = "say";
      $("say").textContent = "再試一次";
      const s2 = document.querySelector(".slot");
      if(s2) s2.classList.remove("no");
    }, 1700);
  }
}

$("input").addEventListener("click", e => {
  const pick = e.target.closest("[data-pick]");
  if(pick){
    if(locked) return;
    pick.classList.add(pick.dataset.pick === q.answer ? "yes" : "no");
    submit(pick.dataset.pick);
    return;
  }
  const b = e.target.closest("[data-key]");
  if(!b) return;
  const k = b.dataset.key;
  if(k === "ok"){ if(typed) submit(Number(typed)); }
  else if(k === "hint") showHint();
  else type(k);
});
document.addEventListener("keydown", e => {
  if(!q) return;
  if(/^[0-9]$/.test(e.key)) type(e.key);
  else if(e.key === "Enter" && typed) submit(Number(typed));
  else if(e.key === "Backspace" || e.key === "Escape") type("clear");
});

/* ---------- 結算 ---------- */
function award(){
  const left = STICKERS.filter(s => S.stickers.indexOf(s) < 0);
  if(!left.length) return "🎉";
  const s = pickOne(left);
  S.stickers.push(s);
  return s;
}
function finish(){
  const n = LEVEL.n, r = run.right, need = Math.ceil(n * 0.7);
  const st = r >= n ? 3 : r >= n-1 ? 2 : r >= need ? 1 : 0;
  const prev = S.stars[LEVEL.id] || 0;
  const firstClear = prev === 0 && st > 0;
  const perfect = st === 3 && prev < 3;
  if(st > prev) S.stars[LEVEL.id] = st;
  if(st > 0 && LEVEL.id < LEVELS.length && S.unlocked < LEVEL.id + 1) S.unlocked = LEVEL.id + 1;

  const prizes = [];
  if(firstClear) prizes.push(award());
  if(perfect) prizes.push(award());
  save();

  $("meter").style.width = "100%";
  setMood(st ? "cheer" : "idle");
  $("stage").innerHTML =
    '<div class="result">' +
      '<div class="row">' + [0,1,2].map(i =>
        '<b class="' + (i < st ? "" : "off") + '">★</b>').join("") + '</div>' +
      '<div class="score">' + r + ' / ' + n + '</div>' +
      '<div class="sub">' + (st ? "過關囉！" : "再對 " + Math.max(1, need - r) + " 題就過關") + '</div>' +
      (prizes.length ? '<div class="prize"><span class="em">' + prizes.join(" ") +
        '</span>拿到新貼紙！</div>' : "") +
    '</div>';
  $("input").innerHTML =
    '<div class="pair"><a class="btn ghost" href="index.html">回小鎮</a>' +
    '<button class="btn" id="again">再玩一次</button></div>';
  $("say").className = "say"; $("say").textContent = "";
  q = null;
  if(st) setTimeout(confetti, 320);
  $("again").onclick = () => {
    run = {i:0, marks:[], right:0};
    nextQuestion();
  };
}

/* ---------- 啟動 ---------- */
$("levelName").textContent = "第 " + LEVEL.id + " 關 · " + LEVEL.name;
setMood("idle");
nextQuestion();
