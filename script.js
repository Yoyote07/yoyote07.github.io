'use strict';

// ─── Typed Hero Name ───────────────────────────
(function initTyped() {
  const el = document.getElementById('typed-name');
  const cursorEl = document.getElementById('cursor-blink');
  const text = 'yoyote';
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 400 : 80 + Math.random() * 50);
    } else {
      setTimeout(() => { cursorEl.style.display = 'none'; }, 2000);
    }
  }

  setTimeout(type, 700);
})();

// ─── Custom Cursor ─────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  (function animate() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  })();

  document.querySelectorAll('a, button, .project-card, .contact-card, .stat-card, .contact-copy').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
})();

// ─── Canvas : particules constellation ────────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COUNT = 88;
  const MAX_DIST = 140;
  const COLORS = ['110,231,247', '139,92,246', '99,102,241'];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomParticle() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: 1.2 + Math.random() * 1.2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.4 + Math.random() * 0.5
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(randomParticle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Lignes entre particules proches
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const opacity = (1 - dist / MAX_DIST) * 0.18;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(110,231,247,${opacity.toFixed(3)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    // Points
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();

      // Déplacement
      p.x += p.vx;
      p.y += p.vy;

      // Rebond sur les bords
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  resize();
  init();
  window.addEventListener('resize', () => { resize(); init(); });
  draw();
})();

// ─── Scroll fade-up ────────────────────────────
(function initScroll() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
})();

// ─── Nav scroll ────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── Mobile menu ───────────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  let open = false;

  const s1 = toggle.querySelector('span:first-child');
  const s2 = toggle.querySelector('span:last-child');

  toggle.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    s1.style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
    s2.style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => {
    open = false;
    menu.classList.remove('open');
    document.body.style.overflow = '';
    s1.style.transform = '';
    s2.style.transform = '';
  }));
})();

// ─── Copy Discord ID feedback ──────────────────
document.querySelectorAll('.contact-copy').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.style.color = 'var(--accent)';
    btn.title = 'Copié !';
    setTimeout(() => { btn.style.color = ''; btn.title = 'Copier'; }, 1500);
  });
});

// ─── Footer year ───────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
