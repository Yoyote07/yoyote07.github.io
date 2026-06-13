/* ==============================================
   PORTFOLIO SCRIPT — Alex Moreau
   ============================================== */

'use strict';

// ─── Typed Hero Name ───────────────────────────
(function initTyped() {
  const el = document.getElementById('typed-name');
  const cursorEl = document.getElementById('cursor-blink');
  const text = 'Alex Moreau';
  let i = 0;

  function type() {
    if (i <= text.length) {
      el.textContent = text.slice(0, i);
      i++;
      setTimeout(type, i === 1 ? 400 : 60 + Math.random() * 40);
    } else {
      // Hide blinking cursor after a moment
      setTimeout(() => {
        cursorEl.style.display = 'none';
      }, 2200);
    }
  }

  setTimeout(type, 700);
})();

// ─── Custom Cursor ─────────────────────────────
(function initCursor() {
  const cursor = document.getElementById('cursor');
  if (!cursor) return;

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function animateCursor() {
    cursorX = lerp(cursorX, mouseX, 0.18);
    cursorY = lerp(cursorY, mouseY, 0.18);
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll('a, button, .project-card, .contact-card, .stat-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
})();

// ─── Canvas Background (subtle dot grid) ───────
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, dots = [];
  const DOT_SPACING = 48;
  const DOT_RADIUS = 0.9;
  const DOT_COLOR = 'rgba(110, 231, 247, 0.18)';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildDots();
  }

  function buildDots() {
    dots = [];
    const cols = Math.ceil(W / DOT_SPACING) + 1;
    const rows = Math.ceil(H / DOT_SPACING) + 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * DOT_SPACING,
          y: r * DOT_SPACING,
          opacity: 0.2 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          speed: 0.003 + Math.random() * 0.004
        });
      }
    }
  }

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    dots.forEach(dot => {
      const pulse = dot.opacity + Math.sin(frame * dot.speed + dot.phase) * 0.15;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = DOT_COLOR.replace('0.18', pulse.toFixed(2));
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();

// ─── Scroll Animations (IntersectionObserver) ──
(function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
})();

// ─── Nav scroll state ───────────────────────────
(function initNav() {
  const nav = document.getElementById('nav');
  let last = 0;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    last = y;
  }, { passive: true });
})();

// ─── Mobile menu ────────────────────────────────
(function initMobileMenu() {
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const links = document.querySelectorAll('.mobile-link');
  let open = false;

  function openMenu() {
    open = true;
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    toggle.querySelector('span:first-child').style.transform = 'translateY(6.5px) rotate(45deg)';
    toggle.querySelector('span:last-child').style.transform = 'translateY(-6.5px) rotate(-45deg)';
  }

  function closeMenu() {
    open = false;
    menu.classList.remove('open');
    document.body.style.overflow = '';
    toggle.querySelector('span:first-child').style.transform = '';
    toggle.querySelector('span:last-child').style.transform = '';
  }

  toggle.addEventListener('click', () => open ? closeMenu() : openMenu());

  links.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
})();

// ─── Footer year ────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();

// ─── Smooth section link highlighting ───────────
(function initActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--text-primary)'
            : '';
        });
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => observer.observe(s));
})();
