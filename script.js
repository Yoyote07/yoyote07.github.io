'use strict';

// ── Typed name ──────────────────────────────────
(function () {
  const el  = document.getElementById('typed-name');
  const cur = document.getElementById('blink');
  const text = 'Yoyote';
  let i = 0;
  el.textContent = '';
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

// ── Carousel infini ─────────────────────────────
// Avant le glow, pour que les cartes copiées en profitent aussi
(function () {
  const inner = document.getElementById('carousel-inner');
  if (!inner) return;
  const clone = inner.cloneNode(true);
  clone.removeAttribute('id');
  clone.setAttribute('aria-hidden', 'true');
  inner.parentElement.appendChild(clone);
})();

// ── Flèches du carrousel ────────────────────────
// Défilement auto : on avance l'animation CSS jusqu'à la carte suivante, puis il reprend.
// Défilement manuel (animations réduites) : on fait défiler la piste.
(function () {
  const track = document.getElementById('carousel-track');
  const prev  = document.getElementById('carousel-prev');
  const next  = document.getElementById('carousel-next');
  if (!track || !prev || !next) return;
  const section = track.closest('.section');
  const inners  = track.querySelectorAll('.carousel-inner');
  const count   = inners[0].children.length;
  let tween = null, aim = null; // aim : carte visée pendant l'animation des flèches

  function cardStep() {
    const card = inners[0].children[0];
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(inners[0]).columnGap);
  }

  function go(dir) {
    const anims = [...inners].flatMap(i => i.getAnimations());
    if (!anims.length) {
      track.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
      return;
    }
    const total = anims[0].effect.getTiming().duration;
    const slot  = total / count;
    const now   = anims[0].currentTime % total;
    // La carte visée s'arrête juste après le fondu du bord gauche (8 % de la largeur)
    const edge  = track.clientWidth * 0.08 / cardStep();
    const index = now / slot + edge;
    // Toujours une carte entière : la suivante (ou précédente) de celle la plus proche du bord
    aim = (aim !== null ? aim : Math.round(index)) + dir;
    let dist = ((aim - edge) * slot - now) % total; // chemin le plus court, boucle comprise
    if (dist > total / 2) dist -= total;
    if (dist < -total / 2) dist += total;
    const start = performance.now();
    const ms = 450;
    cancelAnimationFrame(tween);
    (function frame(t) {
      const p = Math.min((t - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const time = now + dist * eased;
      anims.forEach(a => { a.currentTime = ((time % total) + total) % total; });
      if (p < 1) tween = requestAnimationFrame(frame);
      else aim = null;
    })(start);
  }

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  // Pause tant que la souris est sur les flèches, ou qu'elles ont le focus clavier
  const controls = prev.parentElement;
  const update = () => section.classList.toggle('carousel-hold',
    controls.matches(':hover') || !!controls.querySelector(':focus-visible'));
  ['mouseenter', 'mouseleave', 'focusin', 'focusout'].forEach(ev =>
    controls.addEventListener(ev, () => setTimeout(update)));
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

// ── Lien actif dans le menu ─────────────────────
// Surligne la section qui occupe le milieu de l'écran
(function () {
  const links = document.querySelectorAll('.nav-links a[data-section]');
  const bySection = {};
  links.forEach(l => { bySection[l.dataset.section] = l; });
  function setActive(id) {
    links.forEach(l => {
      const on = l.dataset.section === id;
      l.classList.toggle('active', on);
      if (on) l.setAttribute('aria-current', 'location');
      else l.removeAttribute('aria-current');
    });
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) setActive(bySection[e.target.id] ? e.target.id : null);
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  document.querySelectorAll('main > section[id]').forEach(s => obs.observe(s));
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
  function setOpen(value) {
    open = value;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    s1.style.transform = open ? 'translateY(6.5px) rotate(45deg)' : '';
    s2.style.transform = open ? 'translateY(-6.5px) rotate(-45deg)' : '';
  }
  toggle.addEventListener('click', () => setOpen(!open));
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { setOpen(false); toggle.focus(); }
  });
})();

// ── Copy Discord ────────────────────────────────
function copyDiscord(btn) {
  const pseudo = 'yoyote';
  const toast  = document.getElementById('copy-toast');
  function show(ok) {
    toast.textContent = ok ? 'Copié !' : 'Copie impossible — pseudo : ' + pseudo;
    toast.classList.toggle('error', !ok);
    toast.classList.add('show');
    btn.style.color = ok ? 'var(--acc)' : '';
    clearTimeout(copyDiscord.timer);
    copyDiscord.timer = setTimeout(() => {
      toast.classList.remove('show');
      btn.style.color = '';
    }, ok ? 1500 : 3500);
  }
  function fallback() {
    const ta = document.createElement('textarea');
    ta.value = pseudo;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    ta.remove();
    show(ok);
  }
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(pseudo).then(() => show(true), fallback);
  } else {
    fallback();
  }
}

// ── Footer year ─────────────────────────────────
document.getElementById('year').textContent = new Date().getFullYear();
