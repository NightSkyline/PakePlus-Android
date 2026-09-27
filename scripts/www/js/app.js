/* =====================================================================
   非遗志 · 应用逻辑
   流程：欢迎卷 → 长廊(持续左移) → 点卡 → 影段(模拟视频) → 三问 → 胜/负特效
   ===================================================================== */
(function () {
  "use strict";

  const DATA = window.HERITAGE_DATA || [];
  const CN_NUM = ["一", "二", "三", "四", "五", "六", "七", "八"];
  const OPT_LETTER = ["甲", "乙", "丙", "丁"];

  /* ---------- 工具 ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ============================================================
     1. 欢迎卷 — 飘墨花瓣 + 入境
     ============================================================ */
  function spawnPetals(container, count, opts = {}) {
    const { gold = 0.25, ink = 0.15 } = opts;
    for (let i = 0; i < count; i++) {
      const p = document.createElement("span");
      p.className = "petal";
      const r = Math.random();
      if (r < gold) p.classList.add("petal--gold");
      else if (r < gold + ink) p.classList.add("petal--ink");
      p.style.left = Math.random() * 100 + "%";
      p.style.width = p.style.height = (8 + Math.random() * 12) + "px";
      p.style.animationDuration = (6 + Math.random() * 8) + "s";
      p.style.animationDelay = (-Math.random() * 10) + "s";
      p.style.opacity = 0.4 + Math.random() * 0.5;
      container.appendChild(p);
    }
  }

  function initWelcome() {
    const welcome = $("#welcome");
    const petals = $("#petals");
    const enterBtn = $("#enterBtn");
    const site = $("#site");
    if (!welcome) return;

    spawnPetals(petals, 26, { gold: 0.3, ink: 0.15 });

    const enter = () => {
      welcome.classList.add("is-out");
      site.classList.add("is-on");
      site.setAttribute("aria-hidden", "false");
      welcome.setAttribute("aria-hidden", "true");
      // 触发英雄区图片入场
      $("body").style.setProperty("--hero-img", `url("${DATA[0].image}")`);
      // 滚顶并锁滚动解除
      document.body.style.overflow = "";
      window.scrollTo(0, 0);
      setTimeout(() => welcome.remove(), 1300);
    };

    enterBtn.addEventListener("click", enter);
    document.body.style.overflow = "hidden"; // 入场前锁滚动
  }

  /* ============================================================
     2. 长廊 — 卡片生成 + 持续左移 + 悬停效果
     ============================================================ */
  function buildGallery() {
    const track = $("#galleryTrack");
    if (!track) return;

    // 双倍数据以实现无缝循环
    const items = [...DATA, ...DATA];
    const html = items.map((d, idx) => {
      const realIdx = idx % DATA.length;
      return `
      <article class="card" data-id="${d.id}" data-idx="${realIdx}" tabindex="0" role="button" aria-label="${d.title}">
        <div class="card__top">
          <span class="card__num">第 ${CN_NUM[realIdx]} 门</span>
          <div>
            <h3 class="card__title">${d.title}</h3>
            <p class="card__subtitle">${d.subtitle}</p>
          </div>
          <span class="card__meta">${d.region} · ${d.era}</span>
        </div>
        <div class="card__video">
          <img class="card__video-img" src="${d.image}" alt="${d.title}影段" loading="lazy" />
          <div class="card__video-veil"></div>
          <div class="card__video-frame"></div>
          <span class="card__corner">观·其影</span>
          <span class="card__seal">${d.title.trim().slice(0,1)}</span>
          <div class="card__play">▶</div>
          <div class="card__shine"></div>
        </div>
      </article>`;
    }).join("");
    track.innerHTML = html;

    // 悬停：暂停长廊 + 卡片浮起由 CSS 处理；点击进入详情
    $$(".card", track).forEach(card => {
      card.addEventListener("mouseenter", () => track.classList.add("is-paused"));
      card.addEventListener("mouseleave", () => track.classList.remove("is-paused"));
      card.addEventListener("click", () => openDetail(+card.dataset.idx));
      card.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openDetail(+card.dataset.idx); }
      });
    });
  }

  /* ============================================================
     3. 详情幕 — 影段 + 介绍 + 答题 + 结果
     ============================================================ */
  const state = { idx: 0, data: null, quizIndex: 0, score: 0, answers: [], timer: null, raf: null, fxActive: false };

  function openDetail(idx) {
    const d = DATA[idx];
    if (!d) return;
    state.idx = idx; state.data = d; state.quizIndex = 0; state.score = 0; state.answers = [];

    const panel = $("#detailPanel");
    $("#detailSeal").textContent = d.title.trim().slice(0, 1);
    $("#detailTitle").textContent = d.title;
    $("#detailSubtitle").textContent = d.subtitle;
    $("#detailMeta").innerHTML = `${d.region}<br/>${d.era}`;

    // 介绍正文
    const content = $("#detailContent");
    content.innerHTML =
      `<p class="detail__intro">${esc(d.intro)}</p>` +
      d.body.map(p => `<p class="detail__para">${esc(p)}</p>`).join("");

    // 重置阶段可见性
    showStage("detailStage");
    $("#quiz").classList.remove("is-on");
    $("#quiz").setAttribute("aria-hidden", "true");
    $("#result").classList.remove("is-on", "is-win", "is-lose");
    $("#result").setAttribute("aria-hidden", "true");
    $("#resultStamp").classList.remove("is-stamped");

    // 影段
    $("#playerImg").classList.remove("is-on");
    $("#playerImg").src = d.image;
    $("#playerProgress").style.width = "0%";
    $("#playerLabel").textContent = "观·影·中…";
    $("#playerCaption").classList.remove("is-on");
    $("#playerCaption").textContent = "";
    $("#playerEnded").classList.remove("is-on");
    $("#playerEnded").setAttribute("aria-hidden", "true");
    $("#detailCta").style.display = "none";

    // 开幕
    const detail = $("#detail");
    detail.classList.add("is-on");
    detail.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    // 稍后启动影段（等图片/过渡）
    setTimeout(() => startPlayback(d), 350);
    // 滚到顶
    panel.scrollTop = 0;
  }

  /* —— 影段播放（模拟视频）：进度条 + 字幕分段 + 完结 —— */
  function startPlayback(d) {
    const img = $("#playerImg");
    const bar = $("#playerProgress");
    const label = $("#playerLabel");
    const cap = $("#playerCaption");
    const ended = $("#playerEnded");
    const cta = $("#detailCta");

    clearTimeout(state.timer);
    cancelAnimationFrame(state.raf);

    img.classList.add("is-on");

    const DURATION = 14000; // 14 秒「影段」
    const segments = d.body.map(p => p.length > 46 ? p.slice(0, 44) + "…" : p); // 字幕
    const segLen = DURATION / segments.length;

    const start = performance.now();
    let curSeg = -1;

    function tick(now) {
      const t = Math.min(1, (now - start) / DURATION);
      bar.style.width = (t * 100) + "%";

      const seg = Math.min(segments.length - 1, Math.floor(t * segments.length));
      if (seg !== curSeg) {
        curSeg = seg;
        cap.classList.remove("is-on");
        setTimeout(() => { cap.textContent = segments[seg]; cap.classList.add("is-on"); }, 160);
      }

      if (t < 1) {
        state.raf = requestAnimationFrame(tick);
      } else {
        finishPlayback();
      }
    }
    state.raf = requestAnimationFrame(tick);

    function finishPlayback() {
      cap.classList.remove("is-on");
      ended.classList.add("is-on");
      ended.setAttribute("aria-hidden", "false");
      label.textContent = "影·已·终";
      cta.style.display = "block";
      cta.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  /* —— 略过影段 —— */
  function skipPlayback() {
    cancelAnimationFrame(state.raf);
    $("#playerProgress").style.width = "100%";
    $("#playerCaption").classList.remove("is-on");
    $("#playerEnded").classList.add("is-on");
    $("#playerEnded").setAttribute("aria-hidden", "false");
    $("#playerLabel").textContent = "影·已·终";
    $("#detailCta").style.display = "block";
    $("#detailCta").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function showStage(id) {
    ["detailStage", "quiz", "result"].forEach(s => {
      const el = $("#" + s);
      if (!el) return;
      if (s === id) { el.style.display = ""; }
      else if (s !== "detailStage") { el.classList.remove("is-on"); el.setAttribute("aria-hidden", "true"); }
    });
    if (id === "detailStage") { $("#detailStage").style.display = ""; }
  }

  /* ============================================================
     4. 答题
     ============================================================ */
  function startQuiz() {
    const d = state.data;
    state.quizIndex = 0; state.score = 0; state.answers = [];
    showStage("quiz");
    $("#quiz").classList.add("is-on");
    $("#quiz").setAttribute("aria-hidden", "false");
    $("#quizMeter").querySelectorAll(".quiz__dot").forEach(x => x.classList.remove("is-correct", "is-wrong"));
    renderQuestion();
    $("#quiz").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function renderQuestion() {
    const d = state.data;
    const q = d.quiz[state.quizIndex];
    $("#quizCounter").textContent = `第 ${CN_NUM[state.quizIndex]} 问 / 共 三 问`;
    $("#quizQuestion").textContent = q.q;
    const opts = $("#quizOptions");
    opts.innerHTML = q.options.map((o, i) =>
      `<button class="quiz__opt" data-i="${i}" type="button"><span class="opt-letter">${OPT_LETTER[i]}</span>${esc(o)}</button>`
    ).join("");

    $$(".quiz__opt", opts).forEach(btn => {
      btn.addEventListener("click", () => answer(+btn.dataset.i));
    });
  }

  function answer(i) {
    const d = state.data;
    const q = d.quiz[state.quizIndex];
    const correct = i === q.answer;
    state.answers.push({ i, correct });
    if (correct) state.score++;

    const opts = $$(".quiz__opt", $("#quizOptions"));
    opts.forEach((b, k) => {
      b.classList.add("is-disabled");
      if (k === q.answer) b.classList.add("is-correct");
      if (k === i && !correct) b.classList.add("is-wrong");
    });

    // 更新指示点
    const dot = $("#quizMeter").querySelector(`.quiz__dot[data-i="${state.quizIndex}"]`);
    if (dot) dot.classList.add(correct ? "is-correct" : "is-wrong");

    setTimeout(() => {
      state.quizIndex++;
      if (state.quizIndex < d.quiz.length) renderQuestion();
      else showResult();
    }, 1100);
  }

  /* ============================================================
     5. 结果 — 胜/负特效（canvas 粒子）
     ============================================================ */
  const canvas = $("#fxCanvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  let particles = [];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function showResult() {
    showStage("result");
    const r = $("#result");
    r.classList.add("is-on");
    r.setAttribute("aria-hidden", "false");

    const win = state.score >= 2;
    r.classList.add(win ? "is-win" : "is-lose");

    $("#resultScore").textContent = `答对 ${CN_NUM[state.score]} 问 · 共 三 问`;
    if (win) {
      $("#resultTitle").textContent = "通·关";
      $("#resultStamp").textContent = "通";
      $("#resultDesc").textContent = "君已识其形、明其意。愿此一程，于君心间留此非遗之影，传之不绝。";
    } else {
      $("#resultTitle").textContent = "再·接·再·厉";
      $("#resultStamp").textContent = "续";
      $("#resultDesc").textContent = "匠艺之道，非一日可尽。再观其影，重答其问，必有所得。";
    }

    // 戳章 + 粒子
    setTimeout(() => $("#resultStamp").classList.add("is-stamped"), 80);
    runResultFX(win);

    r.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function runResultFX(win) {
    if (!ctx) return;
    particles = [];
    const W = window.innerWidth, H = window.innerHeight;
    const cx = W / 2, cy = H / 2;

    if (win) {
      // 胜利：金色 + 朱砂粒子爆裂上升
      for (let i = 0; i < 160; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 2 + Math.random() * 7;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp - 2,
          life: 1, decay: 0.006 + Math.random() * 0.01,
          size: 2 + Math.random() * 5,
          color: Math.random() < 0.6 ? "#d4a851" : (Math.random() < 0.5 ? "#b73a2e" : "#f3e9d2"),
          shape: Math.random() < 0.5 ? "petal" : "circle",
          rot: Math.random() * Math.PI, vr: (Math.random() - .5) * .2,
          gravity: 0.04
        });
      }
    } else {
      // 失败：墨点四溅下落
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 1 + Math.random() * 5;
        particles.push({
          x: cx + (Math.random() - .5) * 60, y: cy - 40,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          life: 1, decay: 0.008 + Math.random() * 0.01,
          size: 3 + Math.random() * 9,
          color: Math.random() < 0.7 ? "#1a1208" : "#3b3026",
          shape: "ink",
          rot: 0, vr: 0,
          gravity: 0.12
        });
      }
    }

    state.fxActive = true;
    if (!state._fxLoop) fxLoop();
  }

  function fxLoop() {
    state._fxLoop = true;
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles.length === 0) { state._fxLoop = false; ctx.clearRect(0, 0, canvas.width, canvas.height); return; }

      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += p.gravity; p.vx *= 0.99;
        p.life -= p.decay; p.rot += p.vr;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === "petal") {
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.4, p.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ink") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * (0.6 + p.life * 0.5), 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ============================================================
     6. 关闭/返回/重试
     ============================================================ */
  function closeDetail() {
    const detail = $("#detail");
    detail.classList.remove("is-on");
    detail.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    cancelAnimationFrame(state.raf);
    clearTimeout(state.timer);
    particles = [];
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function retryQuiz() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = [];
    startQuiz();
  }

  /* ============================================================
     7. 绑定 + 启动
     ============================================================ */
  function init() {
    initWelcome();
    buildGallery();
    if (canvas) { resizeCanvas(); window.addEventListener("resize", resizeCanvas); }

    $("#detailClose").addEventListener("click", closeDetail);
    $("#playerSkip").addEventListener("click", skipPlayback);
    $("#playerSkip").addEventListener("keydown", e => { if (e.key === "Enter") skipPlayback(); });
    $("#startQuizBtn").addEventListener("click", startQuiz);
    $("#retryBtn").addEventListener("click", retryQuiz);
    $("#backBtn").addEventListener("click", closeDetail);

    // 点遮罩关闭
    $("#detail .detail__veil").addEventListener("click", closeDetail);
    // ESC 关闭
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && $("#detail").classList.contains("is-on")) closeDetail();
    });

    // 平滑锚点（导航）
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener("click", e => {
        const id = a.getAttribute("href").slice(1);
        const el = document.getElementById(id);
        if (el) { e.preventDefault(); el.scrollIntoView({ behavior: "smooth" }); }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
