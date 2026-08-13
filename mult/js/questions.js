/* ==========================================================
   questions.js — 每一關的出題器
   ========================================================== */

function makeQuestion(lv){

  /* 第 1 關 — 幾個一數（N-2-6）：先建立「相同單位量」的經驗 */
  if(lv === 1){
    const n = pickOne([2,2,5,5,10]), g = rnd(2,5);
    return {
      kind:"number", a:n, b:g, answer:n*g, track:false,
      ask:'一堆有 <span class="hl">' + n + '</span> 個，有 <span class="hl">' + g + '</span> 堆<br>總共幾個？',
      tray:{rows:g, cols:n, split:true},
      hint:() => '跳著數：<span class="jump">' +
        Array.from({length:g}, (_,i) => n*(i+1)).join("、") + '</span>'
    };
  }

  /* 第 2 關 — 連加變乘法（N-2-6）：被乘數 × 乘數，順序有意義 */
  if(lv === 2){
    const n = rnd(2,9);
    let g = rnd(2,5); while(g === n) g = rnd(2,5);
    const right = n + "×" + g;
    const wrong = shuffle([g+"×"+n, n+"+"+g, n+"×"+n, g+"+"+g, n+"+"+n])
                    .filter(w => w !== right).slice(0,3);
    return {
      kind:"choice", a:n, b:g, answer:right, track:false,
      ask:'一盤有 <span class="hl">' + n + '</span> 個花片，有 <span class="hl">' + g + '</span> 盤<br>哪一個算式對？',
      tray:{rows:g, cols:n, split:true},
      options:shuffle([right].concat(wrong)),
      hint:() => Array(g).fill(n).join("＋") + "＝" + n*g + "，就是「" + n + " 的 " + g + " 倍」"
    };
  }

  /* 第 3 關 — 倍的語言（N-2-6） */
  if(lv === 3){
    const n = rnd(2,9), g = rnd(2,9);
    return {
      kind:"number", a:n, b:g, answer:n*g, track:true,
      ask:'<span class="hl">' + n + '</span> 的 <span class="hl">' + g + '</span> 倍是多少？',
      tray:{rows:g, cols:n, split:true, hidden:true},
      hint:() => "就是 " + g + " 個 " + n + "，寫成 " + n + "×" + g
    };
  }

  /* 第 4、5、6 關 — 十十乘法熟練（N-2-7），照教科書分批 */
  if(lv === 4 || lv === 5 || lv === 6){
    const set = lv === 4 ? [2,5,4,8] : lv === 5 ? [3,6,9,7] : [10,1,0];
    const pairs = [];
    for(const t of set) for(let o=1;o<=10;o++) pairs.push([t,o]);
    const p = weakest(pairs);
    let a = p[0], b = p[1];
    if(Math.random() < 0.5 && a !== b){ const t = a; a = b; b = t; }
    return {
      kind:"number", a, b, answer:a*b, track:true, eq:[a,b],
      tray:{rows:a, cols:b, split:false, hidden:true},
      hint:() => a*b === 0 ? "任何數乘以 0 都是 0 喔" : kouJue(a,b)
    };
  }

  /* 第 7 關 — 交換律（R-2-3）：行列模型轉 90 度 */
  if(lv === 7){
    const a = rnd(2,9), b = rnd(2,9);
    return {
      kind:"turn", a, b, answer:a*b, track:true,
      ask:'有 <span class="hl">' + a + '</span> 排，每排 <span class="hl">' + b + '</span> 個，' +
          a + '×' + b + '＝' + a*b + '<br>把盤子轉 90 度呢？',
      tray:{rows:a, cols:b, split:false},
      hint:() => "花片沒有多也沒有少，所以 " + b + "×" + a + " 一樣是 " + a*b
    };
  }

  /* 第 8 關 — 倒著想（n-I-4）：為分裝與平分鋪路 */
  if(lv === 8){
    const pairs = [];
    for(let x=2;x<=9;x++) for(let y=2;y<=9;y++) pairs.push([x,y]);
    const p = weakest(pairs), a = p[0], b = p[1];
    return {
      kind:"number", a, b, answer:a, track:true, eq:["?", b, a*b],
      ask:'<span class="hl">' + a*b + '</span> 個花片，每排放 <span class="hl">' + b + '</span> 個<br>可以排成幾排？',
      tray:{rows:a, cols:b, split:false, hidden:true},
      hint:() => "想想看：幾個 " + b + " 加起來是 " + a*b + "？"
    };
  }

  /* 第 9 關 — 生活問題（N-2-6） */
  const T = [
    ["一盒蘋果有 N 顆，G 盒共有幾顆？", 0],
    ["一輛車有 N 個輪子，G 輛車共有幾個輪子？", 4],
    ["一隻章魚有 N 隻腳，G 隻章魚共有幾隻腳？", 8],
    ["一包餅乾 N 元，買 G 包要多少錢？", 0],
    ["一排座位有 N 個，G 排共有幾個座位？", 0],
    ["一束花有 N 朵，G 束共有幾朵？", 0],
    ["一隻瓢蟲有 N 個點點，G 隻瓢蟲共有幾個點點？", 6]
  ];
  const t = pickOne(T);
  const n = t[1] || rnd(2,9), g = rnd(2,9);
  return {
    kind:"number", a:n, b:g, answer:n*g, track:true,
    ask:t[0].replace("N", '<span class="hl">' + n + '</span>')
            .replace("G", '<span class="hl">' + g + '</span>'),
    tray:{rows:g, cols:n, split:true, hidden:true},
    hint:() => "每 1 份是 " + n + "，有 " + g + " 份 → " + n + "×" + g
  };
}
