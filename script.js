'use strict';

// ─── Typed Hero Name ───────────────────────────
(function initTyped() {
  const el = document.getElementById('typed-name');
  const cursorEl = document.getElementById('cursor-blink');
  const text = 'Yoyote';
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

// ─── Canvas désactivé (aurora CSS) ────────────

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
