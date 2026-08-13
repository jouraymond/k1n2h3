/* ==========================================================
   ui.js — 插畫元件（全部用 SVG 畫，不依賴任何圖檔）
   ========================================================== */

/* ---------- 關卡圖示 ---------- */
const ICONS = {
  flower:'<g><circle cx="24" cy="10" r="7"/><circle cx="38" cy="24" r="7"/><circle cx="24" cy="38" r="7"/><circle cx="10" cy="24" r="7"/><circle cx="24" cy="24" r="7" fill="#FFE9A8"/></g>',
  pencil:'<g><path d="M10 38l3-9 20-20 6 6-20 20z"/><path d="M33 9l6 6 3-3-6-6z" fill="#FFE9A8"/><path d="M10 38l3-9 6 6z" fill="#FFE9A8"/></g>',
  ribbon:'<g><path d="M24 20c-6-10-18-8-18 0s12 10 18 0z"/><path d="M24 20c6-10 18-8 18 0s-12 10-18 0z"/><circle cx="24" cy="20" r="5" fill="#FFE9A8"/><path d="M20 25l-4 15h6l2-11zM28 25l4 15h-6l-2-11z"/></g>',
  apple:'<g><path d="M24 14c-9-6-18 1-18 11 0 8 7 17 12 17 2 0 4-1 6-1s4 1 6 1c5 0 12-9 12-17 0-10-9-17-18-11z"/><path d="M24 14c0-5 3-8 7-9" stroke="#FFE9A8" stroke-width="3" fill="none" stroke-linecap="round"/></g>',
  orange:'<g><circle cx="24" cy="27" r="16"/><circle cx="24" cy="27" r="9" fill="#FFE9A8" opacity=".55"/><path d="M24 11c1-5 5-6 9-5-2 4-5 6-9 5z" fill="#FFE9A8"/></g>',
  grape:'<g><circle cx="24" cy="16" r="6"/><circle cx="15" cy="25" r="6"/><circle cx="33" cy="25" r="6"/><circle cx="24" cy="30" r="6"/><circle cx="19" cy="39" r="6"/><circle cx="29" cy="39" r="6"/><path d="M24 10V4" stroke="#FFE9A8" stroke-width="3" stroke-linecap="round"/></g>',
  swirl:'<path d="M24 6a18 18 0 1 0 18 18 13 13 0 0 0-13-13 9 9 0 0 0-9 9 6 6 0 0 0 6 6" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/>',
  glass:'<g><circle cx="21" cy="21" r="13" fill="none" stroke="currentColor" stroke-width="6"/><path d="M31 31l10 10" stroke="currentColor" stroke-width="7" stroke-linecap="round"/></g>',
  crown:'<g><path d="M8 34l-3-19 11 7 8-13 8 13 11-7-3 19z"/><rect x="8" y="34" width="32" height="7" rx="3" fill="#FFE9A8"/></g>',
  star:'<path d="M12 2l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
  gift:'<g><rect x="3" y="9" width="18" height="12" rx="2"/><rect x="2" y="6" width="20" height="5" rx="2"/><rect x="10" y="4" width="4" height="17" fill="#FFE9A8"/></g>',
  gear:'<g><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="3"/><path d="M12 1v4M12 19v4M1 12h4M19 12h4M4 4l3 3M17 17l3 3M20 4l-3 3M7 17l-3 3" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></g>',
  map:'<g><path d="M2 5l7-3 6 3 7-3v17l-7 3-6-3-7 3z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><path d="M9 2v17M15 5v17" stroke="currentColor" stroke-width="2.5"/></g>'
};
function icon(name, size, color){
  const box = (name === "star" || name === "gift" || name === "gear" || name === "map") ? 24 : 48;
  return '<svg viewBox="0 0 ' + box + ' ' + box + '" width="' + (size||24) + '" height="' + (size||24) +
         '" fill="' + (color || "currentColor") + '">' + ICONS[name] + '</svg>';
}

/* ---------- 小夥伴（小鳥）---------- */
function mascot(mood){
  const eyes = mood === "cheer"
    ? '<path d="M28 40q5-6 10 0M50 40q5-6 10 0" stroke="#22384E" stroke-width="4" fill="none" stroke-linecap="round"/>'
    : mood === "think"
      ? '<circle cx="33" cy="42" r="4.5" fill="#22384E"/><circle cx="55" cy="42" r="4.5" fill="#22384E"/><path d="M26 34l12 3M62 34l-12 3" stroke="#22384E" stroke-width="3" stroke-linecap="round"/>'
      : '<circle cx="33" cy="41" r="5" fill="#22384E"/><circle cx="55" cy="41" r="5" fill="#22384E"/><circle cx="35" cy="39" r="1.8" fill="#fff"/><circle cx="57" cy="39" r="1.8" fill="#fff"/>';
  const mouth = mood === "cheer"
    ? '<path d="M38 52q6 9 12 0z" fill="#E2653A"/>'
    : '<path d="M38 50l6 6 6-6z" fill="#FFC145"/>';
  return '<svg viewBox="0 0 88 88" class="bird">' +
    '<ellipse cx="44" cy="80" rx="22" ry="4" fill="rgba(34,56,78,.13)"/>' +
    '<path d="M44 8c3 0 4 3 3 6l-3 5-3-5c-1-3 0-6 3-6z" fill="#FFC145"/>' +
    '<circle cx="44" cy="45" r="30" fill="#FFD97A"/>' +
    '<circle cx="44" cy="52" r="21" fill="#FFF0C2"/>' +
    '<ellipse cx="14" cy="48" rx="8" ry="13" fill="#FFC145" transform="rotate(-18 14 48)"/>' +
    '<ellipse cx="74" cy="48" rx="8" ry="13" fill="#FFC145" transform="rotate(18 74 48)"/>' +
    '<circle cx="24" cy="52" r="5" fill="#FF9BB1" opacity=".75"/>' +
    '<circle cx="64" cy="52" r="5" fill="#FF9BB1" opacity=".75"/>' +
    eyes + mouth +
    '<path d="M34 74l-4 6M54 74l4 6" stroke="#E2653A" stroke-width="4" stroke-linecap="round"/>' +
    '</svg>';
}

/* ---------- 小鎮場景 ---------- */
const SCENE_W = 400, SCENE_H = 1180;

/* 用 Catmull-Rom 把散點串成平滑小路 */
function smoothPath(pts){
  let d = "M" + pts[0][0] + " " + pts[0][1];
  for(let i=0;i<pts.length-1;i++){
    const p0 = pts[i-1] || pts[i], p1 = pts[i], p2 = pts[i+1], p3 = pts[i+2] || pts[i+1];
    const c1x = p1[0] + (p2[0]-p0[0])/6, c1y = p1[1] + (p2[1]-p0[1])/6;
    const c2x = p2[0] - (p3[0]-p1[0])/6, c2y = p2[1] - (p3[1]-p1[1])/6;
    d += " C" + c1x + " " + c1y + "," + c2x + " " + c2y + "," + p2[0] + " " + p2[1];
  }
  return d;
}
function tree(x,y,s,dark){
  const g = dark ? "#4FAE7B" : "#6BC894";
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="4" rx="16" ry="4" fill="rgba(34,56,78,.09)"/>' +
    '<rect x="-4" y="-16" width="8" height="20" rx="4" fill="#C48C5A"/>' +
    '<circle cx="0" cy="-30" r="20" fill="' + g + '"/>' +
    '<circle cx="-13" cy="-20" r="14" fill="' + g + '"/>' +
    '<circle cx="13" cy="-20" r="14" fill="' + g + '"/>' +
    '<circle cx="-6" cy="-36" r="10" fill="#8FDCB0" opacity=".7"/></g>';
}
function bush(x,y,s){
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
    '<circle cx="-10" cy="0" r="11" fill="#6BC894"/><circle cx="8" cy="-2" r="13" fill="#5FB98D"/>' +
    '<circle cx="0" cy="4" r="10" fill="#8FDCB0"/></g>';
}
function house(x,y,s,roof){
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')">' +
    '<ellipse cx="0" cy="26" rx="30" ry="6" fill="rgba(34,56,78,.09)"/>' +
    '<rect x="-24" y="-6" width="48" height="32" rx="6" fill="#FFF6E2"/>' +
    '<path d="M-30 -4L0 -30 30 -4z" fill="' + roof + '"/>' +
    '<rect x="-8" y="8" width="16" height="18" rx="3" fill="#C48C5A"/>' +
    '<circle cx="-14" cy="6" r="5" fill="#BEE7F5"/><circle cx="14" cy="6" r="5" fill="#BEE7F5"/></g>';
}
function flowerDot(x,y,c){
  return '<g transform="translate(' + x + ',' + y + ')"><circle cx="0" cy="-4" r="3.5" fill="' + c + '"/>' +
    '<circle cx="4" cy="0" r="3.5" fill="' + c + '"/><circle cx="0" cy="4" r="3.5" fill="' + c + '"/>' +
    '<circle cx="-4" cy="0" r="3.5" fill="' + c + '"/><circle cx="0" cy="0" r="2.5" fill="#FFE9A8"/></g>';
}
function cloud(x,y,s,o){
  return '<g transform="translate(' + x + ',' + y + ') scale(' + s + ')" opacity="' + o + '">' +
    '<circle cx="0" cy="0" r="16" fill="#fff"/><circle cx="18" cy="4" r="12" fill="#fff"/>' +
    '<circle cx="-18" cy="5" r="11" fill="#fff"/><rect x="-18" y="0" width="36" height="16" rx="8" fill="#fff"/></g>';
}

function townScene(points){
  const road = [[200,26]].concat(points).concat([[196,1140]]);
  let s = '<svg class="scene" viewBox="0 0 ' + SCENE_W + ' ' + SCENE_H + '" xmlns="http://www.w3.org/2000/svg">';
  /* 草地底 */
  s += '<rect width="' + SCENE_W + '" height="' + SCENE_H + '" fill="#A9E4C4" rx="26"/>';
  s += '<path d="M0 0h400v170q-100 40-200 0T0 150z" fill="#8FDCB0"/>';
  s += '<path d="M0 520q120 46 220 6t180 4v150q-140-40-230 4T0 660z" fill="#8FDCB0" opacity=".75"/>';
  s += '<path d="M0 980q130 44 210 8t190 6v186H0z" fill="#8FDCB0" opacity=".6"/>';
  /* 池塘 */
  s += '<g><ellipse cx="322" cy="600" rx="66" ry="40" fill="#5FB98D"/>' +
       '<ellipse cx="322" cy="598" rx="58" ry="33" fill="#7CC9E8"/>' +
       '<ellipse cx="304" cy="588" rx="18" ry="7" fill="#A8DEF2" opacity=".8"/>' +
       '<ellipse cx="336" cy="608" rx="12" ry="5" fill="#A8DEF2" opacity=".7"/></g>';
  /* 小路 */
  const d = smoothPath(road);
  s += '<path d="' + d + '" fill="none" stroke="#E3CBA3" stroke-width="42" stroke-linecap="round"/>';
  s += '<path d="' + d + '" fill="none" stroke="#F7E9CE" stroke-width="34" stroke-linecap="round"/>';
  s += '<path d="' + d + '" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" ' +
       'stroke-dasharray="12 18" opacity=".85"/>';
  /* 建築與植栽 */
  s += house(316, 120, 1, "#FF8A5B");
  s += house(74, 250, .82, "#4A9BE8");
  s += house(330, 356, .78, "#8367C7");
  s += house(60, 700, .9, "#2EC4B6");
  s += house(320, 830, .8, "#FF6B8A");
  s += tree(44, 150, .85, true) + tree(364, 226, .7) + tree(268, 300, .62, true);
  s += tree(46, 430, .9) + tree(368, 512, .75, true) + tree(150, 676, .6);
  s += tree(44, 902, .8, true) + tree(360, 1004, .85) + tree(288, 1108, .7, true);
  s += bush(146, 198, .8) + bush(276, 398, .7) + bush(52, 566, .75) +
       bush(336, 762, .8) + bush(58, 1046, .7) + bush(258, 986, .75);
  const fc = ["#FF6B8A","#FFC145","#8367C7","#FF8A5B"];
  for(let i=0;i<26;i++){
    const fx = 24 + Math.round((i*137)%352), fy = 60 + Math.round((i*191)%1080);
    s += flowerDot(fx, fy, fc[i%4]);
  }
  /* 終點：小鎮城堡 */
  s += '<g transform="translate(196,1128)">' +
       '<ellipse cx="0" cy="34" rx="52" ry="9" fill="rgba(34,56,78,.12)"/>' +
       '<rect x="-46" y="-14" width="92" height="48" rx="7" fill="#FFF6E2"/>' +
       '<rect x="-46" y="-24" width="20" height="58" rx="5" fill="#FFF0D2"/>' +
       '<rect x="26" y="-24" width="20" height="58" rx="5" fill="#FFF0D2"/>' +
       '<path d="M-52 -14h104l-14-16H-38z" fill="#FF8A5B"/>' +
       '<path d="M-36 -24l0-10 20 0 0 10z" fill="#FF8A5B"/>' +
       '<path d="M16 -24l0-10 20 0 0 10z" fill="#FF8A5B"/>' +
       '<path d="M-14 34v-24a14 14 0 0 1 28 0v24z" fill="#C48C5A"/>' +
       '<circle cx="0" cy="-2" r="6" fill="#BEE7F5"/>' +
       '<rect x="-2" y="-64" width="4" height="30" rx="2" fill="#C48C5A"/>' +
       '<path d="M2 -62h26l-6 8 6 8H2z" fill="#FFC145"/></g>';
  /* 雲（只留天空區，不壓在小路上）*/
  s += cloud(66, 58, 1, .9) + cloud(322, 92, .7, .6);
  s += '</svg>';
  return s;
}

/* ---------- 彩帶 ---------- */
function confetti(){
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = document.createElement("div");
  box.className = "confetti";
  const cols = ["#FF8A5B","#4A9BE8","#FFC145","#2EC4B6","#8367C7","#FF6B8A"];
  for(let i=0;i<18;i++){
    const p = document.createElement("i");
    p.style.background = cols[i % cols.length];
    p.style.setProperty("--dx", rnd(-170,170) + "px");
    p.style.setProperty("--dy", rnd(-160,70) + "px");
    p.style.setProperty("--rot", rnd(-380,380) + "deg");
    p.style.animationDelay = (i*13) + "ms";
    box.appendChild(p);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 1400);
}

/* ---------- HUD ---------- */
function drawHud(active){
  const total = Object.keys(S.stars).reduce((a,k) => a + S.stars[k], 0);
  const el = document.querySelector(".hud");
  if(!el) return;
  el.innerHTML =
    '<div class="logo">花片小鎮</div><div class="sp"></div>' +
    (active === "map" ? "" :
      '<a class="pill" href="index.html">' + icon("map",20,"#4A9BE8") + '</a>') +
    '<a class="pill" href="stickers.html">' + icon("gift",20,"#FF6B8A") +
      '<span>' + S.stickers.length + '</span></a>' +
    (active === "map"
      ? '<span class="pill">' + icon("star",20,"#FFC145") + '<span>' + total + '</span></span>'
      : '') +
    '<a class="pill" href="parent.html">' + icon("gear",20,"#5C7285") + '</a>';
}
