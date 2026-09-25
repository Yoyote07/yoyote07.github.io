'use strict';

// ── Typed name ──────────────────────────────────
(function () {
  const el  = document.getElementById('typed-name');
  const cur = document.getElementById('blink');
  const text = 'Yoyote';
  let i = 0;
  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i++);
      setTimeout(type, i === 1 ? 500 : 80 + Math.random() * 55);
    } else {
      setTimeout(() => { if (cur) cur.style.display = 'none'; }, 2200);
    }
  }
  setTimeout(type, 700);
})();

// ── Custom cursor ───────────────────────────────
(function () {
  const c = document.getElementById('cursor');
  if (!c) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function move() {
    cx += (mx - cx) * 0.16;
    cy += (my - cy) * 0.16;
    c.style.left = cx + 'px';
    c.style.top  = cy + 'px';
    requestAnimationFrame(move);
  })();
  document.querySelectorAll('a, button, .card, .stat, .contact-card').forEach(el => {
    el.addEventListener('mouseenter', () => c.classList.add('hover'));
    el.addEventListener('mouseleave', () => c.classList.remove('hover'));
  });
})();

// ── Carousel infini ─────────────────────────────
(function () {
  const inner = document.getElementById('carousel-inner');
  if (!inner) return;
  const clone = inner.cloneNode(true);
  inner.parentElement.appendChild(clone);
})();

// ── Card mouse-glow ─────────────────────────────
// Suit la souris à l'intérieur de chaque carte et injecte la position en CSS var
(function () {
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1) + '%';
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1) + '%';
      card.style.setProperty('--mx', x);
      card.style.setProperty('--my', y);
    });
  });
})();

// ── Scroll : fade-up + reveal ───────────────────
(function () {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .reveal').forEach(el => obs.observe(el));
})();

// ── Nav scroll ──────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ── Mobile menu ─────────────────────────────────
(function () {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('mobile-menu');
  let open = false;
  const s1 = toggle.querySelector('span:first-child');
  const s2 = toggle.querySelector('span:last-child');
  function close() {
    open = false; menu.classList.remove('open');
    document.body.style.overflow = '';
    s1.style.transform = s2.style.transform = '';
  }
  toggle.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    s1.style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
    s2.style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
  });
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', close));
})();

// ── Copy Discord ────────────────────────────────
function copyDiscord(btn) {
  navigator.clipboard.writeText('yoyote');
  btn.style.color = 'var(--acc)';
  btn.title = 'Copié !';
  setTimeout(() => { btn.style.color = ''; btn.title = 'Copier'; }, 1500);
}

// ── Footer year ─────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
