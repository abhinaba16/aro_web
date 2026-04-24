/* ═══════════════════════════════════════════════════════
   BIRTHDAY WEBSITE — script.js
   All animations, transitions, portrait, fireworks, lanterns
═══════════════════════════════════════════════════════ */

// ── STATE ──
let currentPage = 'home';

// ── UTILS ──
const $ = id => document.getElementById(id);
const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b + 1));

function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active', 'exit');
  });
  const next = document.getElementById('page-' + id);
  next.classList.add('active');
  currentPage = id;
}

function transitionTo(id) {
  const curr = document.querySelector('.page.active');
  if (curr) curr.classList.add('exit');
  setTimeout(() => {
    curr && curr.classList.remove('active', 'exit');
    showPage(id);
    if (id === 'portrait') initPortrait();
    if (id === 'message')  initMessage();
    if (id === 'finale')   initFinale();
  }, 900);
}

/* ═══════════════════════════════════
   PAGE 1 — STARFIELD + TYPEWRITER
═══════════════════════════════════ */
(function initHome() {
  // Starfield
  const canvas = $('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    const n = Math.floor((canvas.width * canvas.height) / 4200);
    for (let i = 0; i < n; i++) {
      stars.push({
        x: rand(0, canvas.width),
        y: rand(0, canvas.height),
        r: rand(0.3, 1.6),
        a: rand(0.3, 1),
        speed: rand(0.3, 1.2),
        phase: rand(0, Math.PI * 2)
      });
    }
  }

  function drawStars(t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      const alpha = s.a * (0.5 + 0.5 * Math.sin(t * s.speed * 0.001 + s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,240,${alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(drawStars);

  // Petals
  const petalsEl = $('petals');
  const petalChars = ['🌸', '✿', '❀', '🌺', '✦'];
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.textContent = petalChars[randInt(0, petalChars.length - 1)];
    p.style.left = rand(0, 100) + 'vw';
    p.style.fontSize = rand(0.7, 1.5) + 'rem';
    p.style.animationDuration = rand(6, 14) + 's';
    p.style.animationDelay = rand(0, 10) + 's';
    petalsEl.appendChild(p);
  }

  // Typewriter
  const target = 'Happy Birthday';
  let idx = 0;
  const el = $('typewriter-title');
  function type() {
    if (idx <= target.length) {
      el.textContent = target.slice(0, idx);
      idx++;
      setTimeout(type, idx < 6 ? 100 : 80);
    } else {
      setTimeout(() => {
        $('friend-name-reveal').classList.add('visible');
      }, 400);
    }
  }
  setTimeout(type, 800);

  $('btn-home-continue').addEventListener('click', () => transitionTo('portrait'));
})();


/* ═══════════════════════════════════
   PAGE 2 — PHOTO PORTRAIT + STARS
═══════════════════════════════════ */
function initPortrait() {

  // ── BACKGROUND STARFIELD ──
  const bgCanvas = $('portrait-stars');
  const bgCtx = bgCanvas.getContext('2d');
  bgCanvas.width  = window.innerWidth;
  bgCanvas.height = window.innerHeight;

  const bgStars = [];
  for (let i = 0; i < 240; i++) {
    bgStars.push({
      x: rand(0, bgCanvas.width),
      y: rand(0, bgCanvas.height),
      r: rand(0.3, 2.2),
      phase: rand(0, Math.PI * 2),
      speed: rand(0.4, 1.4),
      color: Math.random() > 0.5
        ? 'rgba(255,245,210,'
        : Math.random() > 0.5
          ? 'rgba(201,169,110,'
          : 'rgba(232,200,255,'
    });
  }

  const shoots = [];
  function spawnShoot() {
    shoots.push({
      x: rand(0, bgCanvas.width * 0.7),
      y: rand(0, bgCanvas.height * 0.4),
      len: rand(60, 140),
      speed: rand(7, 14),
      alpha: 1
    });
    setTimeout(spawnShoot, rand(1800, 4200));
  }
  spawnShoot();

  function animBgStars(t) {
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
    bgStars.forEach(s => {
      const a = 0.3 + 0.7 * Math.abs(Math.sin(t * 0.001 * s.speed + s.phase));
      bgCtx.beginPath();
      bgCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      bgCtx.fillStyle = s.color + a + ')';
      bgCtx.fill();
      if (s.r > 1.5) {
        bgCtx.strokeStyle = s.color + (a * 0.45) + ')';
        bgCtx.lineWidth = 0.6;
        bgCtx.beginPath();
        bgCtx.moveTo(s.x - s.r * 3, s.y); bgCtx.lineTo(s.x + s.r * 3, s.y);
        bgCtx.moveTo(s.x, s.y - s.r * 3); bgCtx.lineTo(s.x, s.y + s.r * 3);
        bgCtx.stroke();
      }
    });
    shoots.forEach(sh => {
      bgCtx.save(); bgCtx.globalAlpha = sh.alpha;
      const g = bgCtx.createLinearGradient(sh.x, sh.y, sh.x + sh.len, sh.y + sh.len * 0.4);
      g.addColorStop(0, 'rgba(255,255,240,0)');
      g.addColorStop(0.7, 'rgba(255,245,200,0.6)');
      g.addColorStop(1, 'rgba(255,255,255,0.95)');
      bgCtx.strokeStyle = g; bgCtx.lineWidth = 1.5;
      bgCtx.beginPath(); bgCtx.moveTo(sh.x, sh.y); bgCtx.lineTo(sh.x + sh.len, sh.y + sh.len * 0.4);
      bgCtx.stroke(); bgCtx.restore();
      sh.x += sh.speed; sh.y += sh.speed * 0.4; sh.alpha -= 0.018;
    });
    shoots.splice(0, shoots.length, ...shoots.filter(s => s.alpha > 0));
    requestAnimationFrame(animBgStars);
  }
  requestAnimationFrame(animBgStars);

  // ── SHOW PHOTO ──
  const frame = document.querySelector('.photo-frame');
  setTimeout(() => frame.classList.add('show'), 300);

  // ── ORBIT STARS AROUND PHOTO ──
  const orbitCanvas = $('orbit-canvas');
  const orbitCtx = orbitCanvas.getContext('2d');

  function resizeOrbit() {
    orbitCanvas.width  = orbitCanvas.offsetWidth;
    orbitCanvas.height = orbitCanvas.offsetHeight;
  }
  resizeOrbit();

  const CX = orbitCanvas.width  / 2;
  const CY = orbitCanvas.height / 2;

  const orbitParticles = [];
  const rings = [
    { count: 20, rx: CX - 8,  ry: CY - 8,  speed:  0.00038, size: 1.8, col: 'rgba(255,245,210,' },
    { count: 30, rx: CX + 14, ry: CY + 14, speed: -0.00027, size: 1.3, col: 'rgba(201,169,110,' },
    { count: 14, rx: CX - 28, ry: CY - 28, speed:  0.00058, size: 2.5, col: 'rgba(255,255,255,'  },
    { count: 24, rx: CX + 32, ry: CY + 32, speed: -0.00042, size: 1.1, col: 'rgba(232,200,255,' },
  ];

  rings.forEach(ring => {
    for (let i = 0; i < ring.count; i++) {
      orbitParticles.push({
        angle: (i / ring.count) * Math.PI * 2,
        speed: ring.speed * (0.85 + Math.random() * 0.3),
        rx: ring.rx, ry: ring.ry,
        r: rand(0.5, ring.size),
        col: ring.col,
        phase: rand(0, Math.PI * 2),
        twinkleSpeed: rand(0.8, 2.2),
        trail: []
      });
    }
  });

  const bursts = [];
  function spawnBurst() {
    const angle = rand(0, Math.PI * 2);
    const dist  = rand(CX * 0.55, CX * 1.08);
    bursts.push({
      x: CX + Math.cos(angle) * dist,
      y: CY + Math.sin(angle) * dist,
      alpha: 0, growing: true,
      size: rand(2, 4.5),
      col: Math.random() > 0.5 ? 'rgba(255,240,180,' : 'rgba(255,255,255,'
    });
    setTimeout(spawnBurst, rand(600, 1800));
  }
  spawnBurst();

  function animOrbit(t) {
    orbitCtx.clearRect(0, 0, orbitCanvas.width, orbitCanvas.height);

    orbitParticles.forEach(p => {
      p.angle += p.speed * 16;
      const x = CX + p.rx * Math.cos(p.angle);
      const y = CY + p.ry * Math.sin(p.angle);
      p.trail.push({ x, y });
      if (p.trail.length > 6) p.trail.shift();
      p.trail.forEach((pt, i) => {
        orbitCtx.beginPath();
        orbitCtx.arc(pt.x, pt.y, p.r * 0.6, 0, Math.PI * 2);
        orbitCtx.fillStyle = p.col + (i / p.trail.length) * 0.3 + ')';
        orbitCtx.fill();
      });
      const a = 0.5 + 0.5 * Math.abs(Math.sin(t * 0.001 * p.twinkleSpeed + p.phase));
      orbitCtx.beginPath();
      orbitCtx.arc(x, y, p.r, 0, Math.PI * 2);
      orbitCtx.fillStyle = p.col + a + ')';
      orbitCtx.fill();
      if (p.r > 1.8 && a > 0.65) {
        orbitCtx.strokeStyle = p.col + (a * 0.55) + ')';
        orbitCtx.lineWidth = 0.7;
        orbitCtx.beginPath();
        orbitCtx.moveTo(x - p.r * 3.5, y); orbitCtx.lineTo(x + p.r * 3.5, y);
        orbitCtx.moveTo(x, y - p.r * 3.5); orbitCtx.lineTo(x, y + p.r * 3.5);
        orbitCtx.stroke();
      }
    });

    bursts.forEach(b => {
      if (b.growing) { b.alpha += 0.04; if (b.alpha >= 1) b.growing = false; }
      else b.alpha -= 0.015;
      if (b.alpha <= 0) return;
      orbitCtx.beginPath(); orbitCtx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      orbitCtx.fillStyle = b.col + b.alpha + ')'; orbitCtx.fill();
      orbitCtx.strokeStyle = b.col + (b.alpha * 0.7) + ')'; orbitCtx.lineWidth = 0.8;
      orbitCtx.beginPath();
      orbitCtx.moveTo(b.x - b.size * 4, b.y); orbitCtx.lineTo(b.x + b.size * 4, b.y);
      orbitCtx.moveTo(b.x, b.y - b.size * 4); orbitCtx.lineTo(b.x, b.y + b.size * 4);
      orbitCtx.stroke();
    });
    bursts.splice(0, bursts.length, ...bursts.filter(b => b.alpha > 0));

    requestAnimationFrame(animOrbit);
  }
  requestAnimationFrame(animOrbit);

  // ── FLOWER BLOOMS ──
  const flowerEls = $('portrait-flowers');
  const bloomChars = ['🌸', '🌺', '✿', '❀', '🌼', '🌷'];
  const positions = [
    {top:'5%',  left:'-8%'}, {top:'15%', right:'-10%'}, {top:'40%', left:'-12%'},
    {top:'60%', right:'-8%'}, {top:'80%', left:'-6%'},  {top:'85%', right:'-5%'},
    {top:'-4%', left:'20%'}, {top:'-4%', right:'20%'},  {bottom:'-4%', left:'25%'},
    {bottom:'-4%', right:'25%'},
  ];
  positions.forEach((pos, i) => {
    const b = document.createElement('span');
    b.className = 'bloom';
    b.textContent = bloomChars[i % bloomChars.length];
    b.style.setProperty('--rot', rand(-30, 30) + 'deg');
    Object.entries(pos).forEach(([k, v]) => b.style[k] = v);
    flowerEls.appendChild(b);
    setTimeout(() => b.classList.add('show'), 1000 + i * 200);
  });

  // Caption
  setTimeout(() => $('portrait-caption').classList.add('show'), 1600);

  $('btn-portrait-continue').addEventListener('click', () => transitionTo('message'));
}


/* ═══════════════════════════════════
   PAGE 3 — MESSAGE
═══════════════════════════════════ */
function initMessage() {
  // Floating hearts
  const heartsEl = $('msg-hearts');
  const heartChars = ['🌸', '💛', '✦', '🌺', '❀'];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement('span');
    h.className = 'heart-float';
    h.textContent = heartChars[randInt(0, heartChars.length - 1)];
    h.style.left = rand(0, 100) + 'vw';
    h.style.fontSize = rand(0.8, 1.4) + 'rem';
    h.style.animationDuration = rand(7, 15) + 's';
    h.style.animationDelay = rand(0, 8) + 's';
    heartsEl.appendChild(h);
  }

  // Reveal poem lines
  setTimeout(() => {
    document.querySelectorAll('.poem-line').forEach(l => l.classList.add('show'));
  }, 400);

  $('btn-msg-continue').addEventListener('click', () => transitionTo('finale'));
}

/* ═══════════════════════════════════
   PAGE 4 — FINALE
═══════════════════════════════════ */
function initFinale() {

  // ── FIREWORKS ──
  const fwCanvas = $('fireworks-canvas');
  const fwCtx = fwCanvas.getContext('2d');
  fwCanvas.width  = window.innerWidth;
  fwCanvas.height = window.innerHeight;

  const fireworks = [];
  const sparks    = [];

  class Firework {
    constructor() { this.reset(); }
    reset() {
      this.x  = rand(fwCanvas.width * 0.15, fwCanvas.width * 0.85);
      this.y  = fwCanvas.height;
      this.tx = this.x + rand(-60, 60);
      this.ty = rand(fwCanvas.height * 0.1, fwCanvas.height * 0.5);
      this.speed = rand(4, 7);
      this.angle = Math.atan2(this.ty - this.y, this.tx - this.x);
      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;
      this.col = `hsl(${randInt(0,360)},90%,70%)`;
      this.done = false;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y <= this.ty) { this.explode(); this.done = true; }
    }
    explode() {
      const n = randInt(60, 90);
      for (let i = 0; i < n; i++) {
        sparks.push(new Spark(this.x, this.y, this.col));
      }
    }
    draw() {
      fwCtx.beginPath();
      fwCtx.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
      fwCtx.fillStyle = this.col;
      fwCtx.fill();
    }
  }

  class Spark {
    constructor(x, y, col) {
      this.x = x; this.y = y;
      const a = rand(0, Math.PI * 2);
      const spd = rand(1.5, 5);
      this.vx = Math.cos(a) * spd;
      this.vy = Math.sin(a) * spd;
      this.alpha = 1;
      this.decay = rand(0.012, 0.022);
      this.r = rand(1, 2.5);
      this.col = col;
    }
    update() {
      this.vx *= 0.97; this.vy *= 0.97;
      this.vy += 0.07;
      this.x += this.vx; this.y += this.vy;
      this.alpha -= this.decay;
    }
    draw() {
      fwCtx.beginPath();
      fwCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      fwCtx.fillStyle = this.col.replace(')', `,${this.alpha})`).replace('hsl', 'hsla');
      fwCtx.fill();
    }
  }

  let fwLaunched = 0;
  function launchFW() {
    if (fwLaunched < 28) {
      fireworks.push(new Firework());
      fwLaunched++;
      setTimeout(launchFW, rand(280, 700));
    }
  }
  setTimeout(launchFW, 600);

  function animFW() {
    fwCtx.fillStyle = 'rgba(2,1,10,0.18)';
    fwCtx.fillRect(0, 0, fwCanvas.width, fwCanvas.height);

    fireworks.forEach(fw => { fw.update(); fw.draw(); });
    fireworks.splice(0, fireworks.length, ...fireworks.filter(fw => !fw.done));

    sparks.forEach(s => { s.update(); s.draw(); });
    sparks.splice(0, sparks.length, ...sparks.filter(s => s.alpha > 0));

    requestAnimationFrame(animFW);
  }
  animFW();

  // ── LANTERNS ──
  const ltCanvas = $('lanterns-canvas');
  const ltCtx = ltCanvas.getContext('2d');
  ltCanvas.width  = window.innerWidth;
  ltCanvas.height = window.innerHeight;

  const wishes = [
    'Joy', 'Love', 'Peace', 'Laughter', 'Health',
    'Happiness', 'Dreams', 'Light', 'Magic', 'Blessings'
  ];
  const lanterns = [];

  class Lantern {
    constructor(delay) {
      this.x = rand(ltCanvas.width * 0.1, ltCanvas.width * 0.9);
      this.y = ltCanvas.height + 80;
      this.vx = rand(-0.4, 0.4);
      this.vy = rand(0.7, 1.3);
      this.size = rand(28, 48);
      this.alpha = 0;
      this.hue = randInt(30, 55);
      this.wish = wishes[randInt(0, wishes.length - 1)];
      this.active = false;
      setTimeout(() => this.active = true, delay);
    }
    update() {
      if (!this.active) return;
      this.y -= this.vy;
      this.x += this.vx + Math.sin(this.y * 0.02) * 0.3;
      this.alpha = Math.min(1, this.alpha + 0.008);
    }
    draw() {
      if (!this.active) return;
      ltCtx.save();
      ltCtx.globalAlpha = this.alpha * 0.85;
      ltCtx.translate(this.x, this.y);

      // Glow
      const grad = ltCtx.createRadialGradient(0, 0, 0, 0, 0, this.size * 1.8);
      grad.addColorStop(0, `hsla(${this.hue},90%,75%,0.6)`);
      grad.addColorStop(1, `hsla(${this.hue},70%,60%,0)`);
      ltCtx.beginPath();
      ltCtx.arc(0, 0, this.size * 1.8, 0, Math.PI * 2);
      ltCtx.fillStyle = grad;
      ltCtx.fill();

      // Body
      ltCtx.beginPath();
      ltCtx.ellipse(0, 0, this.size * 0.52, this.size * 0.72, 0, 0, Math.PI * 2);
      ltCtx.fillStyle = `hsla(${this.hue},85%,68%,0.9)`;
      ltCtx.fill();
      ltCtx.strokeStyle = `hsla(${this.hue + 10},90%,80%,0.6)`;
      ltCtx.lineWidth = 1.2;
      ltCtx.stroke();

      // Flame
      ltCtx.beginPath();
      ltCtx.ellipse(0, -this.size * 0.72, this.size * 0.18, this.size * 0.32, 0, 0, Math.PI * 2);
      ltCtx.fillStyle = `rgba(255,240,160,0.9)`;
      ltCtx.fill();

      // Wish text
      ltCtx.font = `${this.size * 0.28}px 'Cormorant Garamond', serif`;
      ltCtx.fillStyle = 'rgba(255,240,200,0.9)';
      ltCtx.textAlign = 'center';
      ltCtx.textBaseline = 'middle';
      ltCtx.fillText(this.wish, 0, 0);

      ltCtx.restore();
    }
  }

  for (let i = 0; i < 14; i++) {
    lanterns.push(new Lantern(i * 450 + rand(0, 300)));
  }

  function animLT() {
    ltCtx.clearRect(0, 0, ltCanvas.width, ltCanvas.height);
    lanterns.forEach(l => { l.update(); l.draw(); });
    // Recycle
    lanterns.forEach(l => {
      if (l.active && l.y < -100) {
        l.y = ltCanvas.height + 80;
        l.x = rand(ltCanvas.width * 0.1, ltCanvas.width * 0.9);
        l.alpha = 0;
      }
    });
    requestAnimationFrame(animLT);
  }
  animLT();

  // ── CONFETTI ──
  const confettiEl = $('confetti');
  const confettiColors = ['#c9a96e','#e8a0a0','#f7d4d4','#fff9f0','#f8e8c0','#e8d4a8'];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement('div');
    c.className = 'confetti-piece';
    c.style.left = rand(0, 100) + 'vw';
    c.style.background = confettiColors[randInt(0, confettiColors.length - 1)];
    c.style.width  = rand(5, 11) + 'px';
    c.style.height = rand(5, 11) + 'px';
    c.style.borderRadius = rand(0,1) > 0.5 ? '50%' : '2px';
    c.style.animationDuration = rand(2.5, 5.5) + 's';
    c.style.animationDelay = rand(0, 4) + 's';
    confettiEl.appendChild(c);
  }

  // Window resize
  window.addEventListener('resize', () => {
    fwCanvas.width  = window.innerWidth;
    fwCanvas.height = window.innerHeight;
    ltCanvas.width  = window.innerWidth;
    ltCanvas.height = window.innerHeight;
  });
}